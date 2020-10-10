import { omit, difference, sumBy } from 'lodash';
import { Service, Inject } from 'typedi';
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
      });
    const storeSaleReceiptEntriesOpers: Array<any> = [];

    saleReceipt.entries.forEach((entry: any) => {
      const oper = ItemEntry.query()
        .insert({
          reference_type: 'SaleReceipt',
          reference_id: storedSaleReceipt.id,
          ...omit(entry, ['id', 'amount']),
        });
      storeSaleReceiptEntriesOpers.push(oper);
    });
    await Promise.all([...storeSaleReceiptEntriesOpers]);
    return storedSaleReceipt;
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
    return Promise.all([patchItemsEntries]);
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
    return Promise.all([
      deleteItemsEntriesOper,
      deleteSaleReceiptOper,
      deleteTransactionsOper,
    ]);
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
