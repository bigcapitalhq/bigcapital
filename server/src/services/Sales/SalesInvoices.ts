import { Service, Inject } from 'typedi';
import { omit, sumBy } from 'lodash';
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
} from 'interfaces';
import events from 'subscribers/events';
import InventoryService from 'services/Inventory/Inventory';
import SalesInvoicesCost from 'services/Sales/SalesInvoicesCost';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { formatDateFields } from 'utils';
import { ServiceError } from 'exceptions';
import ItemsService from 'services/Items/ItemsService';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';
import CustomersService from 'services/Contacts/CustomersService';
import SaleEstimateService from 'services/Sales/SalesEstimate';

const ERRORS = {
  INVOICE_NUMBER_NOT_UNIQUE: 'INVOICE_NUMBER_NOT_UNIQUE',
  SALE_INVOICE_NOT_FOUND: 'SALE_INVOICE_NOT_FOUND',
  SALE_INVOICE_ALREADY_DELIVERED: 'SALE_INVOICE_ALREADY_DELIVERED',
  ENTRIES_ITEMS_IDS_NOT_EXISTS: 'ENTRIES_ITEMS_IDS_NOT_EXISTS',
  NOT_SELLABLE_ITEMS: 'NOT_SELLABLE_ITEMS',
  SALE_INVOICE_NO_NOT_UNIQUE: 'SALE_INVOICE_NO_NOT_UNIQUE',
  INVOICE_HAS_ASSOCIATED_PAYMENT_ENTRIES:
    'INVOICE_HAS_ASSOCIATED_PAYMENT_ENTRIES',
};

/**
 * Sales invoices service
 * @service
 */
@Service()
export default class SaleInvoicesService extends SalesInvoicesCost {
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
   * Transform DTO object to model object.
   * @param {number} tenantId - Tenant id.
   * @param {ISaleInvoiceDTO} saleInvoiceDTO - Sale invoice DTO.
   */
  transformDTOToModel(
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceCreateDTO | ISaleInvoiceEditDTO,
    oldSaleInvoice?: ISaleInvoice
  ): ISaleInvoice {
    const { ItemEntry } = this.tenancy.models(tenantId);
    const balance = sumBy(saleInvoiceDTO.entries, (e) =>
      ItemEntry.calcAmount(e)
    );

    return {
      ...formatDateFields(omit(saleInvoiceDTO, ['delivered', 'entries']), [
        'invoiceDate',
        'dueDate',
      ]),
      // Avoid rewrite the deliver date in edit mode when already published.
      ...(saleInvoiceDTO.delivered &&
        !oldSaleInvoice?.deliveredAt && {
          deliveredAt: moment().toMySqlDateTime(),
        }),
      balance,
      paymentAmount: 0,
      entries: saleInvoiceDTO.entries.map((entry) => ({
        reference_type: 'SaleInvoice',
        ...omit(entry, ['amount', 'id']),
      })),
    };
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
    saleInvoiceDTO: ISaleInvoiceCreateDTO
  ): Promise<ISaleInvoice> {
    const { saleInvoiceRepository } = this.tenancy.repositories(tenantId);

    // Transform DTO object to model object.
    const saleInvoiceObj = this.transformDTOToModel(tenantId, saleInvoiceDTO);

    // Validate customer existance.
    await this.customersService.getCustomerByIdOrThrowError(
      tenantId,
      saleInvoiceDTO.customerId
    );
    // Validate sale invoice number uniquiness.
    if (saleInvoiceDTO.invoiceNo) {
      await this.validateInvoiceNumberUnique(
        tenantId,
        saleInvoiceDTO.invoiceNo
      );
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
      saleInvoiceId: saleInvoice.id,
    });
    this.logger.info('[sale_invoice] successfully inserted.', {
      tenantId,
      saleInvoice,
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
    saleInvoiceDTO: any
  ): Promise<ISaleInvoice> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const oldSaleInvoice = await this.getInvoiceOrThrowError(
      tenantId,
      saleInvoiceId
    );
    // Transform DTO object to model object.
    const saleInvoiceObj = this.transformDTOToModel(
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

    this.logger.info('[sale_invoice] trying to update sale invoice.');
    const saleInvoice: ISaleInvoice = await SaleInvoice.query().upsertGraphAndFetch(
      {
        id: saleInvoiceId,
        ...saleInvoiceObj,
      }
    );
    // Triggers `onSaleInvoiceEdited` event.
    await this.eventDispatcher.dispatch(events.saleInvoice.onEdited, {
      saleInvoice,
      oldSaleInvoice,
      tenantId,
      saleInvoiceId,
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
    saleInvoiceId: number
  ): Promise<void> {
    const { saleInvoiceRepository } = this.tenancy.repositories(tenantId);

    // Retrieve details of the given sale invoice id.
    const saleInvoice = await this.getInvoiceOrThrowError(
      tenantId,
      saleInvoiceId
    );

    // Throws error in case the sale invoice already published.
    if (saleInvoice.isDelivered) {
      throw new ServiceError(ERRORS.SALE_INVOICE_ALREADY_DELIVERED);
    }
    // Record the delivered at on the storage.
    await saleInvoiceRepository.update(
      {
        deliveredAt: moment().toMySqlDateTime(),
      },
      { id: saleInvoiceId }
    );
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
   * Deletes the given sale invoice with associated entries
   * and journal transactions.
   * @async
   * @param {Number} saleInvoiceId - The given sale invoice id.
   */
  public async deleteSaleInvoice(
    tenantId: number,
    saleInvoiceId: number
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
    await saleInvoiceRepository.deleteById(saleInvoiceId);

    await ItemEntry.query()
      .where('reference_id', saleInvoiceId)
      .where('reference_type', 'SaleInvoice')
      .delete();

    // Triggers `onSaleInvoiceDeleted` event.
    await this.eventDispatcher.dispatch(events.saleInvoice.onDeleted, {
      tenantId,
      oldSaleInvoice,
      saleInvoiceId,
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
    saleInvoiceId: number,
    saleInvoiceDate: Date,
    override?: boolean
  ): Promise<void> {
    // Gets the next inventory lot number.
    const lotNumber = this.inventoryService.getNextLotNumber(tenantId);

    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries = await this.itemsEntriesService.getInventoryEntries(
      tenantId,
      'SaleInvoice',
      saleInvoiceId
    );
    // Can't continue if there is no entries has inventory items in the invoice.
    if (inventoryEntries.length <= 0) return;

    // Inventory transactions.
    const inventoryTranscations = this.inventoryService.transformItemEntriesToInventory(
      inventoryEntries,
      'SaleInvoice',
      saleInvoiceId,
      'OUT',
      saleInvoiceDate,
      lotNumber
    );
    // Records the inventory transactions of the given sale invoice.
    await this.inventoryService.recordInventoryTransactions(
      tenantId,
      inventoryTranscations,
      override
    );
    // Increment and save the next lot number settings.
    await this.inventoryService.incrementNextLotNumber(tenantId);

    // Triggers `onInventoryTransactionsCreated` event.
    await this.eventDispatcher.dispatch(
      events.saleInvoice.onInventoryTransactionsCreated,
      {
        tenantId,
        saleInvoiceId,
      }
    );
  }

  /**
   * Records the journal entries of the given sale invoice just
   * in case the invoice has no inventory items entries.
   *
   * @param {number} tenantId -
   * @param {number} saleInvoiceId
   * @param {boolean} override
   * @return {Promise<void>}
   */
  public async recordNonInventoryJournalEntries(
    tenantId: number,
    saleInvoiceId: number,
    override: boolean = false
  ): Promise<void> {
    const { saleInvoiceRepository } = this.tenancy.repositories(tenantId);

    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries = await this.itemsEntriesService.getInventoryEntries(
      tenantId,
      'SaleInvoice',
      saleInvoiceId
    );
    // Can't continue if the sale invoice has inventory items entries.
    if (inventoryEntries.length > 0) return;

    const saleInvoice = await saleInvoiceRepository.findOneById(
      saleInvoiceId,
      'entries.item'
    );

    await this.writeNonInventoryInvoiceEntries(tenantId, saleInvoice, override);
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
    const { inventoryTransactionRepository } = this.tenancy.repositories(
      tenantId
    );

    // Retrieve the inventory transactions of the given sale invoice.
    const oldInventoryTransactions = await inventoryTransactionRepository.find({
      transactionId: saleInvoiceId,
      transactionType: 'SaleInvoice',
    });
    // Delete the inventory transaction of the given sale invoice.
    await this.inventoryService.deleteInventoryTransactions(
      tenantId,
      saleInvoiceId,
      'SaleInvoice'
    );
    // Triggers 'onInventoryTransactionsDeleted' event.
    this.eventDispatcher.dispatch(
      events.saleInvoice.onInventoryTransactionsDeleted,
      { tenantId, saleInvoiceId, oldInventoryTransactions }
    );
  }

  /**
   * Retrieve sale invoice with associated entries.
   * @async
   * @param {Number} saleInvoiceId
   */
  public async getSaleInvoice(
    tenantId: number,
    saleInvoiceId: number
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

      if (customerId) {
        query.where('customer_id', customerId);
      }
    });
    return salesInvoices;
  }
}
