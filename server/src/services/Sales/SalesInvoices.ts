import { Service, Inject } from 'typedi';
import { omit, sumBy, join } from 'lodash';
import moment from 'moment';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import {
  ISaleInvoice,
  ISaleInvoiceCreateDTO,
  ISaleInvoiceEditDTO,
  ISalesInvoicesFilter,
  IPaginationMeta,
  IFilterMeta,
  ISystemUser,
  IItem,
  IItemEntry,
} from 'interfaces';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalCommands from 'services/Accounting/JournalCommands';
import events from 'subscribers/events';
import InventoryService from 'services/Inventory/Inventory';
import TenancyService from 'services/Tenancy/TenancyService';
import { formatDateFields } from 'utils';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { ServiceError } from 'exceptions';
import ItemsService from 'services/Items/ItemsService';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';
import CustomersService from 'services/Contacts/CustomersService';
import SaleEstimateService from 'services/Sales/SalesEstimate';
import JournalPosterService from './JournalPosterService';
import AutoIncrementOrdersService from './AutoIncrementOrdersService';
import { ERRORS } from './constants';

/**
 * Sales invoices service
 * @service
 */
@Service()
export default class SaleInvoicesService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  inventoryService: InventoryService;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  @Inject('logger')
  logger: any;

  @Inject()
  dynamicListService: DynamicListingService;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  itemsService: ItemsService;

  @Inject()
  customersService: CustomersService;

  @Inject()
  saleEstimatesService: SaleEstimateService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  autoIncrementOrdersService: AutoIncrementOrdersService;

  /**
   * Validate whether sale invoice number unqiue on the storage.
   */
  async validateInvoiceNumberUnique(
    tenantId: number,
    invoiceNumber: string,
    notInvoiceId?: number
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    this.logger.info(
      '[sale_invoice] validating sale invoice number existance.',
      { tenantId, invoiceNumber }
    );
    const saleInvoice = await SaleInvoice.query()
      .findOne('invoice_no', invoiceNumber)
      .onBuild((builder) => {
        if (notInvoiceId) {
          builder.whereNot('id', notInvoiceId);
        }
      });

    if (saleInvoice) {
      this.logger.info('[sale_invoice] sale invoice number not unique.', {
        tenantId,
        invoiceNumber,
      });
      throw new ServiceError(ERRORS.INVOICE_NUMBER_NOT_UNIQUE);
    }
  }

  /**
   * Validate the sale invoice has no payment entries.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   */
  async validateInvoiceHasNoPaymentEntries(
    tenantId: number,
    saleInvoiceId: number
  ) {
    const { PaymentReceiveEntry } = this.tenancy.models(tenantId);

    // Retrieve the sale invoice associated payment receive entries.
    const entries = await PaymentReceiveEntry.query().where(
      'invoice_id',
      saleInvoiceId
    );
    if (entries.length > 0) {
      throw new ServiceError(ERRORS.INVOICE_HAS_ASSOCIATED_PAYMENT_ENTRIES);
    }
    return entries;
  }

  /**
   * Validate the invoice amount is bigger than payment amount before edit the invoice.
   * @param {number} saleInvoiceAmount
   * @param {number} paymentAmount
   */
  validateInvoiceAmountBiggerPaymentAmount(
    saleInvoiceAmount: number,
    paymentAmount: number
  ) {
    if (saleInvoiceAmount < paymentAmount) {
      throw new ServiceError(ERRORS.INVOICE_AMOUNT_SMALLER_THAN_PAYMENT_AMOUNT);
    }
  }

  /**
   * Validate whether sale invoice exists on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async getInvoiceOrThrowError(tenantId: number, saleInvoiceId: number) {
    const { saleInvoiceRepository } = this.tenancy.repositories(tenantId);

    const saleInvoice = await saleInvoiceRepository.findOneById(
      saleInvoiceId,
      'entries'
    );
    if (!saleInvoice) {
      throw new ServiceError(ERRORS.SALE_INVOICE_NOT_FOUND);
    }
    return saleInvoice;
  }

  /**
   * Retrieve the next unique invoice number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  getNextInvoiceNumber(tenantId: number): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'sales_invoices'
    );
  }

  /**
   * Increment the invoice next number.
   * @param {number} tenantId -
   */
  incrementNextInvoiceNumber(tenantId: number) {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'sales_invoices'
    );
  }

  /**
   * Transformes the create DTO to invoice object model.
   * @param {ISaleInvoiceCreateDTO} saleInvoiceDTO - Sale invoice DTO.
   * @param {ISaleInvoice} oldSaleInvoice - Old sale invoice.
   * @return {ISaleInvoice}
   */
  private async transformDTOToModel(
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceCreateDTO | ISaleInvoiceEditDTO,
    oldSaleInvoice?: ISaleInvoice
  ): Promise<ISaleInvoice> {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const balance = sumBy(saleInvoiceDTO.entries, (e) =>
      ItemEntry.calcAmount(e)
    );
    // Retrieve customer details.
    const customer = await this.customersService.getCustomerByIdOrThrowError(
      tenantId,
      saleInvoiceDTO.customerId
    );
    // Retreive the next invoice number.
    const autoNextNumber = this.getNextInvoiceNumber(tenantId);

    // Invoice number.
    const invoiceNo =
      saleInvoiceDTO.invoiceNo || oldSaleInvoice?.invoiceNo || autoNextNumber;

    // Validate the invoice is required.
    this.validateInvoiceNoRequire(invoiceNo);

    return {
      ...formatDateFields(
        omit(saleInvoiceDTO, ['delivered', 'entries', 'fromEstimateId']),
        ['invoiceDate', 'dueDate']
      ),
      // Avoid rewrite the deliver date in edit mode when already published.
      balance,
      currencyCode: customer.currencyCode,
      ...(saleInvoiceDTO.delivered &&
        !oldSaleInvoice?.deliveredAt && {
          deliveredAt: moment().toMySqlDateTime(),
        }),
      // Avoid override payment amount in edit mode.
      ...(!oldSaleInvoice && { paymentAmount: 0 }),
      ...(invoiceNo ? { invoiceNo } : {}),
      entries: saleInvoiceDTO.entries.map((entry) => ({
        referenceType: 'SaleInvoice',
        ...entry,
      })),
    };
  }

  /**
   * Validate the invoice number require.
   * @param {ISaleInvoice} saleInvoiceObj
   */
  validateInvoiceNoRequire(invoiceNo: string) {
    if (!invoiceNo) {
      throw new ServiceError(ERRORS.SALE_INVOICE_NO_IS_REQUIRED);
    }
  }

  /**
   * Creates a new sale invoices and store it to the storage
   * with associated to entries and journal transactions.
   * @async
   * @param  {number} tenantId - Tenant id.
   * @param  {ISaleInvoice} saleInvoiceDTO - Sale invoice object DTO.
   * @return {Promise<ISaleInvoice>}
   */
  public async createSaleInvoice(
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceCreateDTO,
    authorizedUser: ISystemUser
  ): Promise<ISaleInvoice> {
    const { saleInvoiceRepository } = this.tenancy.repositories(tenantId);

    // Transform DTO object to model object.
    const saleInvoiceObj = await this.transformDTOToModel(
      tenantId,
      saleInvoiceDTO
    );
    // Validate customer existance.
    await this.customersService.getCustomerByIdOrThrowError(
      tenantId,
      saleInvoiceDTO.customerId
    );
    // Validate sale invoice number uniquiness.
    if (saleInvoiceObj.invoiceNo) {
      await this.validateInvoiceNumberUnique(
        tenantId,
        saleInvoiceObj.invoiceNo
      );
    }
    // Validate the from estimate id exists on the storage.
    if (saleInvoiceDTO.fromEstimateId) {
      const fromEstimate = await this.saleEstimatesService.getSaleEstimateOrThrowError(
        tenantId,
        saleInvoiceDTO.fromEstimateId
      );
      // Validate the sale estimate is not already converted to invoice.
      this.saleEstimatesService.validateEstimateNotConverted(fromEstimate);
    }
    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Validate items should be sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      saleInvoiceDTO.entries
    );

    this.logger.info('[sale_invoice] inserting sale invoice to the storage.');
    const saleInvoice = await saleInvoiceRepository.upsertGraph({
      ...saleInvoiceObj,
    });
    // Triggers the event `onSaleInvoiceCreated`.
    await this.eventDispatcher.dispatch(events.saleInvoice.onCreated, {
      tenantId,
      saleInvoice,
      saleInvoiceDTO,
      saleInvoiceId: saleInvoice.id,
      authorizedUser,
    });
    this.logger.info('[sale_invoice] successfully inserted.', {
      tenantId,
      saleInvoiceId: saleInvoice.id,
    });

    return saleInvoice;
  }

  /**
   * Edit the given sale invoice.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {Number} saleInvoiceId - Sale invoice id.
   * @param {ISaleInvoice} saleInvoice - Sale invoice DTO object.
   * @return {Promise<ISaleInvoice>}
   */
  public async editSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    saleInvoiceDTO: ISaleInvoiceEditDTO,
    authorizedUser: ISystemUser
  ): Promise<ISaleInvoice> {
    const { saleInvoiceRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the sale invoice or throw not found service error.
    const oldSaleInvoice = await this.getInvoiceOrThrowError(
      tenantId,
      saleInvoiceId
    );
    // Transform DTO object to model object.
    const saleInvoiceObj = await this.transformDTOToModel(
      tenantId,
      saleInvoiceDTO,
      oldSaleInvoice
    );
    // Validate customer existance.
    await this.customersService.getCustomerByIdOrThrowError(
      tenantId,
      saleInvoiceDTO.customerId
    );
    // Validate sale invoice number uniquiness.
    if (saleInvoiceDTO.invoiceNo) {
      await this.validateInvoiceNumberUnique(
        tenantId,
        saleInvoiceDTO.invoiceNo,
        saleInvoiceId
      );
    }
    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Validate non-sellable entries items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Validate the items entries existance.
    await this.itemsEntriesService.validateEntriesIdsExistance(
      tenantId,
      saleInvoiceId,
      'SaleInvoice',
      saleInvoiceDTO.entries
    );
    // Validate the invoice amount is not smaller than the invoice payment amount.
    this.validateInvoiceAmountBiggerPaymentAmount(
      saleInvoiceObj.balance,
      oldSaleInvoice.paymentAmount
    );

    this.logger.info('[sale_invoice] trying to update sale invoice.');
    const saleInvoice: ISaleInvoice = await saleInvoiceRepository.upsertGraph({
      id: saleInvoiceId,
      ...saleInvoiceObj,
    });
    // Triggers `onSaleInvoiceEdited` event.
    await this.eventDispatcher.dispatch(events.saleInvoice.onEdited, {
      tenantId,
      saleInvoiceId,
      saleInvoice,
      oldSaleInvoice,
      authorizedUser,
    });
    return saleInvoice;
  }

  /**
   * Deliver the given sale invoice.
   * @param  {number} tenantId - Tenant id.
   * @param  {number} saleInvoiceId - Sale invoice id.
   * @return {Promise<void>}
   */
  public async deliverSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    authorizedUser: ISystemUser
  ): Promise<void> {
    const { saleInvoiceRepository } = this.tenancy.repositories(tenantId);

    // Retrieve details of the given sale invoice id.
    const oldSaleInvoice = await this.getInvoiceOrThrowError(
      tenantId,
      saleInvoiceId
    );
    // Throws error in case the sale invoice already published.
    if (oldSaleInvoice.isDelivered) {
      throw new ServiceError(ERRORS.SALE_INVOICE_ALREADY_DELIVERED);
    }
    // Record the delivered at on the storage.
    await saleInvoiceRepository.update(
      { deliveredAt: moment().toMySqlDateTime() },
      { id: saleInvoiceId }
    );
    // Triggers `onSaleInvoiceDelivered` event.
    this.eventDispatcher.dispatch(events.saleInvoice.onDelivered, {
      tenantId,
      saleInvoiceId,
      oldSaleInvoice,
    });
  }

  /**
   * Deletes the given sale invoice with associated entries
   * and journal transactions.
   * @param {number} tenantId - Tenant id.
   * @param {Number} saleInvoiceId - The given sale invoice id.
   * @param {ISystemUser} authorizedUser -
   */
  public async deleteSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    authorizedUser: ISystemUser
  ): Promise<void> {
    const { ItemEntry } = this.tenancy.models(tenantId);
    const { saleInvoiceRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the given sale invoice with associated entries or throw not found error.
    const oldSaleInvoice = await this.getInvoiceOrThrowError(
      tenantId,
      saleInvoiceId
    );
    // Validate the sale invoice has no associated payment entries.
    await this.validateInvoiceHasNoPaymentEntries(tenantId, saleInvoiceId);

    // Triggers `onSaleInvoiceDelete` event.
    await this.eventDispatcher.dispatch(events.saleInvoice.onDelete, {
      tenantId,
      saleInvoice: oldSaleInvoice,
      saleInvoiceId,
    });
    // Unlink the converted sale estimates from the given sale invoice.
    await this.saleEstimatesService.unlinkConvertedEstimateFromInvoice(
      tenantId,
      saleInvoiceId
    );
    this.logger.info('[sale_invoice] delete sale invoice with entries.');

    await ItemEntry.query()
      .where('reference_id', saleInvoiceId)
      .where('reference_type', 'SaleInvoice')
      .delete();

    await saleInvoiceRepository.deleteById(saleInvoiceId);

    // Triggers `onSaleInvoiceDeleted` event.
    await this.eventDispatcher.dispatch(events.saleInvoice.onDeleted, {
      tenantId,
      oldSaleInvoice,
      saleInvoiceId,
      authorizedUser,
    });
  }

  /**
   * Records the inventory transactions of the given sale invoice in case
   * the invoice has inventory entries only.
   *
   * @param {number} tenantId - Tenant id.
   * @param {SaleInvoice} saleInvoice - Sale invoice DTO.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {boolean} override - Allow to override old transactions.
   * @return {Promise<void>}
   */
  public async recordInventoryTranscactions(
    tenantId: number,
    saleInvoice: ISaleInvoice,
    override?: boolean
  ): Promise<void> {
    await this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      tenantId,
      saleInvoice.id,
      'SaleInvoice',
      saleInvoice.invoiceDate,
      'OUT',
      override
    );
  }

  /**
   * Writes the sale invoice income journal entries.
   * @param {number} tenantId - Tenant id.
   * @param {ISaleInvoice} saleInvoice - Sale invoice id.
   */
  public async writesIncomeJournalEntries(
    tenantId: number,
    saleInvoice: ISaleInvoice & {
      entries: IItemEntry & { item: IItem };
    },
    override: boolean = false
  ): Promise<void> {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    const receivableAccount = await accountRepository.findOne({
      slug: 'accounts-receivable',
    });
    if (override) {
      await journalCommands.revertInvoiceIncomeEntries(saleInvoice.id);
    }
    // Records the sale invoice journal entries.
    await journalCommands.saleInvoiceIncomeEntries(
      saleInvoice,
      receivableAccount.id
    );
    await Promise.all([
      journal.deleteEntries(),
      journal.saveBalance(),
      journal.saveContactsBalance(),
      journal.saveEntries(),
    ]);
  }

  /**
   * Reverting the inventory transactions once the invoice deleted.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async revertInventoryTransactions(
    tenantId: number,
    saleInvoiceId: number
  ): Promise<void> {
    // Delete the inventory transaction of the given sale invoice.
    const {
      oldInventoryTransactions,
    } = await this.inventoryService.deleteInventoryTransactions(
      tenantId,
      saleInvoiceId,
      'SaleInvoice'
    );
  }

  /**
   * Reverting the sale invoice journal entries.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @return {Promise<void>}
   */
  public async revertInvoiceJournalEntries(
    tenantId: number,
    saleInvoiceId: number | number[]
  ): Promise<void> {
    return this.journalService.revertJournalTransactions(
      tenantId,
      saleInvoiceId,
      'SaleInvoice'
    );
  }

  /**
   * Retrieve sale invoice with associated entries.
   * @param {Number} saleInvoiceId -
   * @param {ISystemUser} authorizedUser -
   * @return {Promise<ISaleInvoice>}
   */
  public async getSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    authorizedUser: ISystemUser
  ): Promise<ISaleInvoice> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('entries')
      .withGraphFetched('customer');

    if (!saleInvoice) {
      throw new ServiceError(ERRORS.SALE_INVOICE_NOT_FOUND);
    }
    return saleInvoice;
  }

  /**
   * Retrieve sales invoices filterable and paginated list.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async salesInvoicesList(
    tenantId: number,
    salesInvoicesFilter: ISalesInvoicesFilter
  ): Promise<{
    salesInvoices: ISaleInvoice[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      SaleInvoice,
      salesInvoicesFilter
    );

    this.logger.info('[sale_invoice] try to get sales invoices list.', {
      tenantId,
      salesInvoicesFilter,
    });
    const { results, pagination } = await SaleInvoice.query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries');
        builder.withGraphFetched('customer');
        dynamicFilter.buildQuery()(builder);
      })
      .pagination(salesInvoicesFilter.page - 1, salesInvoicesFilter.pageSize);

    return {
      salesInvoices: results,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Retrieve due sales invoices.
   * @param {number} tenantId
   * @param {number} customerId
   */
  public async getPayableInvoices(
    tenantId: number,
    customerId?: number
  ): Promise<ISaleInvoice> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const salesInvoices = await SaleInvoice.query().onBuild((query) => {
      query.modify('dueInvoices');
      query.modify('delivered');

      if (customerId) {
        query.where('customer_id', customerId);
      }
    });

    return salesInvoices;
  }
}
