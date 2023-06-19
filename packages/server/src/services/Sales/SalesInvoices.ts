import { Service, Inject } from 'typedi';
import { omit, sumBy } from 'lodash';
import * as R from 'ramda';
import moment from 'moment';
import { Knex } from 'knex';
import composeAsync from 'async/compose';
import {
  ISaleInvoice,
  ISaleInvoiceCreateDTO,
  ISaleInvoiceEditDTO,
  ISalesInvoicesFilter,
  IPaginationMeta,
  IFilterMeta,
  ISystemUser,
  ISalesInvoicesService,
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletePayload,
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEventDeliveredPayload,
  ISaleInvoiceEditedPayload,
  ISaleInvoiceCreatingPayload,
  ISaleInvoiceEditingPayload,
  ISaleInvoiceDeliveringPayload,
  ICustomer,
  ITenantUser,
} from '@/interfaces';
import events from '@/subscribers/events';
import InventoryService from '@/services/Inventory/Inventory';
import TenancyService from '@/services/Tenancy/TenancyService';
import { formatDateFields } from 'utils';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import SaleEstimateService from '@/services/Sales/SalesEstimate';
import AutoIncrementOrdersService from './AutoIncrementOrdersService';
import { ERRORS } from './constants';
import { SaleInvoiceTransformer } from './SaleInvoiceTransformer';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

/**
 * Sales invoices service
 * @service
 */
@Service('SalesInvoices')
export default class SaleInvoicesService implements ISalesInvoicesService {
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

  @Inject()
  private saleEstimatesService: SaleEstimateService;

  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Validate whether sale invoice number unqiue on the storage.
   */
  async validateInvoiceNumberUnique(
    tenantId: number,
    invoiceNumber: string,
    notInvoiceId?: number
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findOne('invoice_no', invoiceNumber)
      .onBuild((builder) => {
        if (notInvoiceId) {
          builder.whereNot('id', notInvoiceId);
        }
      });

    if (saleInvoice) {
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
   * Transformes edit DTO to model.
   * @param {number} tennatId -
   * @param {ICustomer} customer -
   * @param {ISaleInvoiceEditDTO} saleInvoiceDTO -
   * @param {ISaleInvoice} oldSaleInvoice
   */
  private tranformEditDTOToModel = async (
    tenantId: number,
    customer: ICustomer,
    saleInvoiceDTO: ISaleInvoiceEditDTO,
    oldSaleInvoice: ISaleInvoice,
    authorizedUser: ITenantUser
  ) => {
    return this.transformDTOToModel(
      tenantId,
      customer,
      saleInvoiceDTO,
      authorizedUser,
      oldSaleInvoice
    );
  };

  /**
   * Transformes create DTO to model.
   * @param {number} tenantId -
   * @param {ICustomer} customer -
   * @param {ISaleInvoiceCreateDTO} saleInvoiceDTO -
   */
  private transformCreateDTOToModel = async (
    tenantId: number,
    customer: ICustomer,
    saleInvoiceDTO: ISaleInvoiceCreateDTO,
    authorizedUser: ITenantUser
  ) => {
    return this.transformDTOToModel(
      tenantId,
      customer,
      saleInvoiceDTO,
      authorizedUser
    );
  };

  /**
   * Transformes the create DTO to invoice object model.
   * @param  {ISaleInvoiceCreateDTO} saleInvoiceDTO - Sale invoice DTO.
   * @param  {ISaleInvoice} oldSaleInvoice - Old sale invoice.
   * @return {ISaleInvoice}
   */
  private async transformDTOToModel(
    tenantId: number,
    customer: ICustomer,
    saleInvoiceDTO: ISaleInvoiceCreateDTO | ISaleInvoiceEditDTO,
    authorizedUser: ITenantUser,
    oldSaleInvoice?: ISaleInvoice
  ): Promise<ISaleInvoice> {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const balance = sumBy(saleInvoiceDTO.entries, (e) =>
      ItemEntry.calcAmount(e)
    );
    // Retrieve the next invoice number.
    const autoNextNumber = this.getNextInvoiceNumber(tenantId);

    // Invoice number.
    const invoiceNo =
      saleInvoiceDTO.invoiceNo || oldSaleInvoice?.invoiceNo || autoNextNumber;

    // Validate the invoice is required.
    this.validateInvoiceNoRequire(invoiceNo);

    const initialEntries = saleInvoiceDTO.entries.map((entry) => ({
      referenceType: 'SaleInvoice',
      ...entry,
    }));
    const entries = await composeAsync(
      // Sets default cost and sell account to invoice items entries.
      this.itemsEntriesService.setItemsEntriesDefaultAccounts(tenantId)
    )(initialEntries);

    const initialDTO = {
      ...formatDateFields(
        omit(saleInvoiceDTO, ['delivered', 'entries', 'fromEstimateId']),
        ['invoiceDate', 'dueDate']
      ),
      // Avoid rewrite the deliver date in edit mode when already published.
      balance,
      currencyCode: customer.currencyCode,
      exchangeRate: saleInvoiceDTO.exchangeRate || 1,
      ...(saleInvoiceDTO.delivered &&
        !oldSaleInvoice?.deliveredAt && {
          deliveredAt: moment().toMySqlDateTime(),
        }),
      // Avoid override payment amount in edit mode.
      ...(!oldSaleInvoice && { paymentAmount: 0 }),
      ...(invoiceNo ? { invoiceNo } : {}),
      entries,
      userId: authorizedUser.id,
    } as ISaleInvoice;

    return R.compose(
      this.branchDTOTransform.transformDTO<ISaleInvoice>(tenantId),
      this.warehouseDTOTransform.transformDTO<ISaleInvoice>(tenantId)
    )(initialDTO);
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
  public createSaleInvoice = async (
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceCreateDTO,
    authorizedUser: ITenantUser
  ): Promise<ISaleInvoice> => {
    const { SaleInvoice, Contact } = this.tenancy.models(tenantId);

    // Validate customer existence.
    const customer = await Contact.query()
      .modify('customer')
      .findById(saleInvoiceDTO.customerId)
      .throwIfNotFound();

    // Validate the from estimate id exists on the storage.
    if (saleInvoiceDTO.fromEstimateId) {
      const fromEstimate =
        await this.saleEstimatesService.getSaleEstimateOrThrowError(
          tenantId,
          saleInvoiceDTO.fromEstimateId
        );
      // Validate the sale estimate is not already converted to invoice.
      this.saleEstimatesService.validateEstimateNotConverted(fromEstimate);
    }
    // Validate items ids existence.
    await this.itemsEntriesService.validateItemsIdsExistence(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Validate items should be sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Transform DTO object to model object.
    const saleInvoiceObj = await this.transformCreateDTOToModel(
      tenantId,
      customer,
      saleInvoiceDTO,
      authorizedUser
    );
    // Validate sale invoice number uniquiness.
    if (saleInvoiceObj.invoiceNo) {
      await this.validateInvoiceNumberUnique(
        tenantId,
        saleInvoiceObj.invoiceNo
      );
    }
    // Creates a new sale invoice and associated transactions under unit of work env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceCreating` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onCreating, {
        saleInvoiceDTO,
        tenantId,
        trx,
      } as ISaleInvoiceCreatingPayload);

      // Create sale invoice graph to the storage.
      const saleInvoice = await SaleInvoice.query(trx).upsertGraph(
        saleInvoiceObj
      );
      const eventPayload: ISaleInvoiceCreatedPayload = {
        tenantId,
        saleInvoice,
        saleInvoiceDTO,
        saleInvoiceId: saleInvoice.id,
        authorizedUser,
        trx,
      };
      // Triggers the event `onSaleInvoiceCreated`.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onCreated,
        eventPayload
      );
      return saleInvoice;
    });
  };

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
    const { SaleInvoice, Contact } = this.tenancy.models(tenantId);

    // Retrieve the sale invoice or throw not found service error.
    const oldSaleInvoice = await this.getInvoiceOrThrowError(
      tenantId,
      saleInvoiceId
    );
    // Validate customer existence.
    const customer = await Contact.query()
      .findById(saleInvoiceDTO.customerId)
      .modify('customer')
      .throwIfNotFound();

    // Validate items ids existence.
    await this.itemsEntriesService.validateItemsIdsExistence(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Validate non-sellable entries items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Validate the items entries existence.
    await this.itemsEntriesService.validateEntriesIdsExistence(
      tenantId,
      saleInvoiceId,
      'SaleInvoice',
      saleInvoiceDTO.entries
    );
    // Transform DTO object to model object.
    const saleInvoiceObj = await this.tranformEditDTOToModel(
      tenantId,
      customer,
      saleInvoiceDTO,
      oldSaleInvoice,
      authorizedUser
    );
    // Validate sale invoice number uniquiness.
    if (saleInvoiceObj.invoiceNo) {
      await this.validateInvoiceNumberUnique(
        tenantId,
        saleInvoiceObj.invoiceNo,
        saleInvoiceId
      );
    }
    // Validate the invoice amount is not smaller than the invoice payment amount.
    this.validateInvoiceAmountBiggerPaymentAmount(
      saleInvoiceObj.balance,
      oldSaleInvoice.paymentAmount
    );
    // Edit sale invoice transaction in UOW environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceEditing` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onEditing, {
        trx,
        oldSaleInvoice,
        tenantId,
        saleInvoiceDTO,
      } as ISaleInvoiceEditingPayload);

      // Upsert the the invoice graph to the storage.
      const saleInvoice: ISaleInvoice =
        await SaleInvoice.query().upsertGraphAndFetch({
          id: saleInvoiceId,
          ...saleInvoiceObj,
        });
      // Edit event payload.
      const editEventPayload: ISaleInvoiceEditedPayload = {
        tenantId,
        saleInvoiceId,
        saleInvoice,
        saleInvoiceDTO,
        oldSaleInvoice,
        authorizedUser,
        trx,
      };
      // Triggers `onSaleInvoiceEdited` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onEdited,
        editEventPayload
      );
      return saleInvoice;
    });
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
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale invoice id.
    const oldSaleInvoice = await this.getInvoiceOrThrowError(
      tenantId,
      saleInvoiceId
    );
    // Throws error in case the sale invoice already published.
    if (oldSaleInvoice.isDelivered) {
      throw new ServiceError(ERRORS.SALE_INVOICE_ALREADY_DELIVERED);
    }
    // Update sale invoice transaction with associate transactions
    // under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceDelivering` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onDelivering, {
        tenantId,
        oldSaleInvoice,
        trx,
      } as ISaleInvoiceDeliveringPayload);

      // Record the delivered at on the storage.
      const saleInvoice = await SaleInvoice.query(trx)
        .where({ id: saleInvoiceId })
        .update({ deliveredAt: moment().toMySqlDateTime() });

      // Triggers `onSaleInvoiceDelivered` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onDelivered, {
        tenantId,
        saleInvoiceId,
        saleInvoice,
      } as ISaleInvoiceEventDeliveredPayload);
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
    const { ItemEntry, SaleInvoice } = this.tenancy.models(tenantId);

    // Retrieve the given sale invoice with associated entries
    // or throw not found error.
    const oldSaleInvoice = await this.getInvoiceOrThrowError(
      tenantId,
      saleInvoiceId
    );
    // Validate the sale invoice has no associated payment entries.
    await this.validateInvoiceHasNoPaymentEntries(tenantId, saleInvoiceId);

    // Validate the sale invoice has applied to credit note transaction.
    await this.validateInvoiceHasNoAppliedToCredit(tenantId, saleInvoiceId);

    // Deletes sale invoice transaction and associate transactions with UOW env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceDelete` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onDeleting, {
        tenantId,
        saleInvoice: oldSaleInvoice,
        saleInvoiceId,
        trx,
      } as ISaleInvoiceDeletePayload);

      // Unlink the converted sale estimates from the given sale invoice.
      await this.saleEstimatesService.unlinkConvertedEstimateFromInvoice(
        tenantId,
        saleInvoiceId,
        trx
      );
      await ItemEntry.query(trx)
        .where('reference_id', saleInvoiceId)
        .where('reference_type', 'SaleInvoice')
        .delete();

      await SaleInvoice.query(trx).findById(saleInvoiceId).delete();

      // Triggers `onSaleInvoiceDeleted` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onDeleted, {
        tenantId,
        oldSaleInvoice,
        saleInvoiceId,
        authorizedUser,
        trx,
      } as ISaleInvoiceDeletedPayload);
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
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        tenantId,
        saleInvoice.entries
      );
    const transaction = {
      transactionId: saleInvoice.id,
      transactionType: 'SaleInvoice',
      transactionNumber: saleInvoice.invoiceNo,

      exchangeRate: saleInvoice.exchangeRate,
      warehouseId: saleInvoice.warehouseId,

      date: saleInvoice.invoiceDate,
      direction: 'OUT',
      entries: inventoryEntries,
      createdAt: saleInvoice.createdAt,
    };
    await this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      tenantId,
      transaction,
      override,
      trx
    );
  }
  /**
   * Reverting the inventory transactions once the invoice deleted.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async revertInventoryTransactions(
    tenantId: number,
    saleInvoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Delete the inventory transaction of the given sale invoice.
    const { oldInventoryTransactions } =
      await this.inventoryService.deleteInventoryTransactions(
        tenantId,
        saleInvoiceId,
        'SaleInvoice',
        trx
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
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('branch');

    return this.transformer.transform(
      tenantId,
      saleInvoice,
      new SaleInvoiceTransformer()
    );
  }

  /**
   * Parses the sale invoice list filter DTO.
   * @param filterDTO
   * @returns
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve sales invoices filterable and paginated list.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async salesInvoicesList(
    tenantId: number,
    filterDTO: ISalesInvoicesFilter
  ): Promise<{
    salesInvoices: ISaleInvoice[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      SaleInvoice,
      filter
    );
    const { results, pagination } = await SaleInvoice.query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries');
        builder.withGraphFetched('customer');
        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed sale invoices.
    const salesInvoices = await this.transformer.transform(
      tenantId,
      results,
      new SaleInvoiceTransformer()
    );

    return {
      salesInvoices,
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

  /**
   * Validate the given customer has no sales invoices.
   * @param {number} tenantId
   * @param {number} customerId - Customer id.
   */
  public async validateCustomerHasNoInvoices(
    tenantId: number,
    customerId: number
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoices = await SaleInvoice.query().where('customer_id', customerId);

    if (invoices.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_SALES_INVOICES);
    }
  }

  /**
   * Validate the sale invoice has no applied to credit note transaction.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns {Promise<void>}
   */
  public validateInvoiceHasNoAppliedToCredit = async (
    tenantId: number,
    invoiceId: number
  ): Promise<void> => {
    const { CreditNoteAppliedInvoice } = this.tenancy.models(tenantId);

    const appliedTransactions = await CreditNoteAppliedInvoice.query().where(
      'invoiceId',
      invoiceId
    );
    if (appliedTransactions.length > 0) {
      throw new ServiceError(ERRORS.SALE_INVOICE_HAS_APPLIED_TO_CREDIT_NOTES);
    }
  };
}
