import { omit, sumBy } from 'lodash';
import { Service, Inject } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import events from 'subscribers/events';
import { ISaleReceipt } from 'interfaces';
import JournalPosterService from 'services/Sales/JournalPosterService';
import TenancyService from 'services/Tenancy/TenancyService';
import { formatDateFields } from 'utils';
import { IFilterMeta, IPaginationMeta } from 'interfaces';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { ServiceError } from 'exceptions';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';


const ERRORS = {
  SALE_RECEIPT_NOT_FOUND: 'SALE_RECEIPT_NOT_FOUND',
  DEPOSIT_ACCOUNT_NOT_FOUND: 'DEPOSIT_ACCOUNT_NOT_FOUND',
  DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET: 'DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET',
};
@Service()
export default class SalesReceiptService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject('logger')
  logger: any;

  /**
   * Validate whether sale receipt exists on the storage.
   * @param {number} tenantId - 
   * @param {number} saleReceiptId - 
   */
  async getSaleReceiptOrThrowError(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    this.logger.info('[sale_receipt] trying to validate existance.', { tenantId, saleReceiptId });
    const foundSaleReceipt = await SaleReceipt.query().findById(saleReceiptId);

    if (!foundSaleReceipt) {
      this.logger.info('[sale_receipt] not found on the storage.', { tenantId, saleReceiptId });
      throw new ServiceError(ERRORS.SALE_RECEIPT_NOT_FOUND);
    }
    return foundSaleReceipt;
  }
 
  /**
   * Validate whether sale receipt deposit account exists on the storage.
   * @param {number} tenantId - 
   * @param {number} accountId -
   */
  async validateReceiptDepositAccountExistance(tenantId: number, accountId: number) {
    const { accountRepository, accountTypeRepository } = this.tenancy.repositories(tenantId);
    const depositAccount = await accountRepository.findById(accountId);

    if (!depositAccount) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_NOT_FOUND);
    }
    const depositAccountType = await accountTypeRepository.getTypeMeta(depositAccount.accountTypeId);

    if (!depositAccountType || depositAccountType.childRoot === 'current_asset') {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET);
    }
  }

  /**
   * Creates a new sale receipt with associated entries.
   * @async
   * @param {ISaleReceipt} saleReceipt
   * @return {Object}
   */
  public async createSaleReceipt(tenantId: number, saleReceiptDTO: any): Promise<ISaleReceipt> {
    const { SaleReceipt, ItemEntry } = this.tenancy.models(tenantId);

    const amount = sumBy(saleReceiptDTO.entries, e => ItemEntry.calcAmount(e));
    const saleReceiptObj = {
      amount,
      ...formatDateFields(saleReceiptDTO, ['receipt_date'])
    };
    await this.validateReceiptDepositAccountExistance(tenantId, saleReceiptDTO.depositAccountId);
    await this.itemsEntriesService.validateItemsIdsExistance(tenantId, saleReceiptDTO.entries);
    await this.itemsEntriesService.validateNonSellableEntriesItems(tenantId, saleReceiptDTO.entries);

    this.logger.info('[sale_receipt] trying to insert sale receipt graph.', { tenantId, saleReceiptDTO });
    const saleReceipt = await SaleReceipt.query()
      .insertGraphAndFetch({
        ...omit(saleReceiptObj, ['entries']),

        entries: saleReceiptObj.entries.map((entry) => ({
          reference_type: 'SaleReceipt',
          ...omit(entry, ['id', 'amount']),
        }))
      });
    await this.eventDispatcher.dispatch(events.saleReceipt.onCreated, { tenantId, saleReceipt });

    this.logger.info('[sale_receipt] sale receipt inserted successfully.', { tenantId });

    return saleReceipt;
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
    const saleReceiptObj = {
      amount,
      ...formatDateFields(saleReceiptDTO, ['receipt_date'])
    };
    const oldSaleReceipt = await this.getSaleReceiptOrThrowError(tenantId, saleReceiptId);

    await this.validateReceiptDepositAccountExistance(tenantId, saleReceiptDTO.depositAccountId);
    await this.itemsEntriesService.validateItemsIdsExistance(tenantId, saleReceiptDTO.entries);
    await this.itemsEntriesService.validateNonSellableEntriesItems(tenantId, saleReceiptDTO.entries);

    const saleReceipt = await SaleReceipt.query()
      .upsertGraphAndFetch({
        id: saleReceiptId,
        ...omit(saleReceiptObj, ['entries']),

        entries: saleReceiptObj.entries.map((entry) => ({
          reference_type: 'SaleReceipt',
          ...omit(entry, ['amount']),
        }))
      });

    this.logger.info('[sale_receipt] edited successfully.', { tenantId, saleReceiptId });
    await this.eventDispatcher.dispatch(events.saleReceipt.onEdited, {
      oldSaleReceipt, tenantId, saleReceiptId, saleReceipt,
    });
    return saleReceipt;
  }

  /**
   * Deletes the sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {void}
   */
  public async deleteSaleReceipt(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt, ItemEntry } = this.tenancy.models(tenantId);

    await ItemEntry.query()
      .where('reference_id', saleReceiptId)
      .where('reference_type', 'SaleReceipt')
      .delete();
    
    await SaleReceipt.query().where('id', saleReceiptId).delete();

    this.logger.info('[sale_receipt] deleted successfully.', { tenantId, saleReceiptId });
    await this.eventDispatcher.dispatch(events.saleReceipt.onDeleted);
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
