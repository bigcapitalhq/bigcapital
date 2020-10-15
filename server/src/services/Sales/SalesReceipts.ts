import { omit, difference, sumBy } from 'lodash';
import { Service, Inject } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import events from 'subscribers/events';
import JournalPosterService from 'services/Sales/JournalPosterService';
import HasItemEntries from 'services/Sales/HasItemsEntries';
import TenancyService from 'services/Tenancy/TenancyService';
import { formatDateFields } from 'utils';
import { IFilterMeta, IPaginationMeta } from 'interfaces';
import DynamicListingService from 'services/DynamicListing/DynamicListService';

@Service()
export default class SalesReceiptService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  itemsEntriesService: HasItemEntries;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  /**
   * Validate whether sale receipt exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   */
  async getSaleReceiptOrThrowError(tenantId: number, saleReceiptId: number) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;

    const isSaleReceiptExists = await this.saleReceiptService
      .isSaleReceiptExists(
        tenantId,
        saleReceiptId,
      );
    if (!isSaleReceiptExists) {
      return res.status(404).send({
        errors: [{ type: 'SALE.RECEIPT.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate whether sale receipt customer exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateReceiptCustomerExistance(req: Request, res: Response, next: Function) {
    const saleReceipt = { ...req.body };
    const { Customer } = req.models;

    const foundCustomer = await Customer.query().findById(saleReceipt.customer_id);

    if (!foundCustomer) {
      return res.status(400).send({ 
        errors: [{ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate whether sale receipt deposit account exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateReceiptDepositAccountExistance(req: Request, res: Response, next: Function) {
    const { tenantId } = req;

    const saleReceipt = { ...req.body };
    const isDepositAccountExists = await this.accountsService.isAccountExists(
      tenantId,
      saleReceipt.deposit_account_id
    );
    if (!isDepositAccountExists) {
      return res.status(400).send({
        errors: [{ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validate whether receipt items ids exist on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateReceiptItemsIdsExistance(req: Request, res: Response, next: Function) {
    const { tenantId } = req;

    const saleReceipt = { ...req.body };    
    const estimateItemsIds = saleReceipt.entries.map((e) => e.item_id);

    const notFoundItemsIds = await this.itemsService.isItemsIdsExists(
      tenantId,
      estimateItemsIds
    );
    if (notFoundItemsIds.length > 0) {
      return res.status(400).send({ errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 400 }] });
    }
    next();
  }

  /**
   * Validate receipt entries ids existance on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateReceiptEntriesIds(req: Request, res: Response, next: Function) {
    const { tenantId } = req;

    const saleReceipt = { ...req.body };
    const { id: saleReceiptId } = req.params;

    // Validate the entries IDs that not stored or associated to the sale receipt.
    const notExistsEntriesIds = await this.saleReceiptService
      .isSaleReceiptEntriesIDsExists(
        tenantId,
        saleReceiptId,
        saleReceipt,
      );
    if (notExistsEntriesIds.length > 0) {
      return res.status(400).send({ errors: [{
          type: 'ENTRIES.IDS.NOT.FOUND',
          code: 500,
        }]
      });
    }
    next();
  }


  /**
   * Creates a new sale receipt with associated entries.
   * @async
   * @param {ISaleReceipt} saleReceipt
   * @return {Object}
   */
  public async createSaleReceipt(tenantId: number, saleReceiptDTO: any) {
    const { SaleReceipt, ItemEntry } = this.tenancy.models(tenantId);

    const amount = sumBy(saleReceiptDTO.entries, e => ItemEntry.calcAmount(e));
    const saleReceipt = {
      amount,
      ...formatDateFields(saleReceiptDTO, ['receipt_date'])
    };
    const storedSaleReceipt = await SaleReceipt.query()
      .insert({
        ...omit(saleReceipt, ['entries']),
        entries: saleReceipt.entries.map((entry) => ({
          reference_type: 'SaleReceipt',
          reference_id: storedSaleReceipt.id,
          ...omit(entry, ['id', 'amount']),
        }))
      });

    await this.eventDispatcher.dispatch(events.saleReceipts.onCreated);
  }

  /**
   * Edit details sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @param {ISaleReceipt} saleReceipt
   * @return {void}
   */
  public async editSaleReceipt(tenantId: number, saleReceiptId: number, saleReceiptDTO: any) {
    const { SaleReceipt, ItemEntry } = this.tenancy.models(tenantId);

    const amount = sumBy(saleReceiptDTO.entries, e => ItemEntry.calcAmount(e));
    const saleReceipt = {
      amount,
      ...formatDateFields(saleReceiptDTO, ['receipt_date'])
    };
    const updatedSaleReceipt = await SaleReceipt.query()
      .where('id', saleReceiptId)
      .update({
        ...omit(saleReceipt, ['entries']),
      });
    const storedSaleReceiptEntries = await ItemEntry.query()
      .where('reference_id', saleReceiptId)
      .where('reference_type', 'SaleReceipt');

    // Patch sale receipt items entries.
    const patchItemsEntries = this.itemsEntriesService.patchItemsEntries(
      tenantId,
      saleReceipt.entries,
      storedSaleReceiptEntries,
      'SaleReceipt',
      saleReceiptId,
    );
    await Promise.all([patchItemsEntries]);

    await this.eventDispatcher.dispatch(events.saleReceipts.onCreated);
  }

  /**
   * Deletes the sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {void}
   */
  public async deleteSaleReceipt(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt, ItemEntry } = this.tenancy.models(tenantId);
    const deleteSaleReceiptOper = SaleReceipt.query()
      .where('id', saleReceiptId)
      .delete();

    const deleteItemsEntriesOper = ItemEntry.query()
      .where('reference_id', saleReceiptId)
      .where('reference_type', 'SaleReceipt')
      .delete();

    // Delete all associated journal transactions to payment receive transaction.
    const deleteTransactionsOper = this.journalService.deleteJournalTransactions(
      tenantId,
      saleReceiptId,
      'SaleReceipt'
    );
    await Promise.all([
      deleteItemsEntriesOper,
      deleteSaleReceiptOper,
      deleteTransactionsOper,
    ]);

    await this.eventDispatcher.dispatch(events.saleReceipts.onDeleted);
  }

  /**
   * Validates the given sale receipt ID exists.
   * @param {Integer} saleReceiptId
   * @returns {Boolean}
   */
  async isSaleReceiptExists(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);
    const foundSaleReceipt = await SaleReceipt.query()
      .where('id', saleReceiptId);
    return foundSaleReceipt.length !== 0;
  }

  /**
   * Detarmines the sale receipt entries IDs exists.
   * @param {Integer} saleReceiptId
   * @param {ISaleReceipt} saleReceipt
   */
  async isSaleReceiptEntriesIDsExists(tenantId: number, saleReceiptId: number, saleReceipt: any) {
    const { ItemEntry } = this.tenancy.models(tenantId);
    const entriesIDs = saleReceipt.entries
      .filter((e) => e.id)
      .map((e) => e.id);

    const storedEntries = await ItemEntry.query()
      .whereIn('id', entriesIDs)
      .where('reference_id', saleReceiptId)
      .where('reference_type', 'SaleReceipt');

    const storedEntriesIDs = storedEntries.map((e: any) => e.id);
    const notFoundEntriesIDs = difference(
      entriesIDs,
      storedEntriesIDs
    );
    return notFoundEntriesIDs;
  }

  /**
   * Retrieve sale receipt with associated entries.
   * @param {Integer} saleReceiptId 
   */
  async getSaleReceiptWithEntries(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);
    const saleReceipt = await SaleReceipt.query()
      .where('id', saleReceiptId)
      .withGraphFetched('entries');

    return saleReceipt;
  }

  /**
   * Retrieve sales receipts paginated and filterable list.
   * @param {number} tenantId 
   * @param {ISaleReceiptFilter} salesReceiptsFilter 
   */
  public async salesReceiptsList(
    tenantId: number,
    salesReceiptsFilter: ISaleReceiptFilter,
  ): Promise<{ salesReceipts: ISaleReceipt[], pagination: IPaginationMeta, filterMeta: IFilterMeta }> {
    const { SaleReceipt } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(tenantId, SaleReceipt, salesReceiptsFilter);

    this.logger.info('[sale_receipt] try to get sales receipts list.', { tenantId });
    const { results, pagination } = await SaleReceipt.query().onBuild((builder) => {
      builder.withGraphFetched('depositAccount');
      builder.withGraphFetched('customer');
      builder.withGraphFetched('entries');

      dynamicFilter.buildQuery()(builder);
    }).pagination(
      salesReceiptsFilter.page - 1,
      salesReceiptsFilter.pageSize,
    );

    return {
      salesReceipts: results,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }
}
