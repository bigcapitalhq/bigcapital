import { omit, sumBy } from 'lodash';
import { Service, Inject } from 'typedi';
import moment from 'moment';
import * as R from 'ramda';
import { Knex } from 'knex';
import composeAsync from 'async/compose';
import events from '@/subscribers/events';
import {
  IFilterMeta,
  IPaginationMeta,
  ISaleReceipt,
  ISaleReceiptDTO,
  ISalesReceiptsService,
  ISaleReceiptCreatedPayload,
  ISaleReceiptEditedPayload,
  ISaleReceiptEventClosedPayload,
  ISaleReceiptEventDeletedPayload,
  ISaleReceiptCreatingPayload,
  ISaleReceiptDeletingPayload,
  ISaleReceiptEditingPayload,
  ISaleReceiptEventClosingPayload,
  ICustomer,
} from '@/interfaces';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import TenancyService from '@/services/Tenancy/TenancyService';
import { formatDateFields } from 'utils';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import { ItemEntry } from 'models';
import InventoryService from '@/services/Inventory/Inventory';
import { ACCOUNT_PARENT_TYPE } from '@/data/AccountTypes';
import AutoIncrementOrdersService from './AutoIncrementOrdersService';
import { ERRORS } from './Receipts/constants';
import { SaleReceiptTransformer } from './Receipts/SaleReceiptTransformer';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service('SalesReceipts')
export default class SalesReceiptService implements ISalesReceiptsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  @Inject()
  inventoryService: InventoryService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject('logger')
  logger: any;

  @Inject()
  autoIncrementOrdersService: AutoIncrementOrdersService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  warehouseDTOTransform: WarehouseTransactionDTOTransform;

  @Inject()
  transformer: TransformerInjectable;

  /**
   * Validate whether sale receipt exists on the storage.
   * @param {number} tenantId -
   * @param {number} saleReceiptId -
   */
  async getSaleReceiptOrThrowError(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const foundSaleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries');

    if (!foundSaleReceipt) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_NOT_FOUND);
    }
    return foundSaleReceipt;
  }

  /**
   * Validate whether sale receipt deposit account exists on the storage.
   * @param {number} tenantId - Tenant id.
   * @param {number} accountId - Account id.
   */
  async validateReceiptDepositAccountExistence(
    tenantId: number,
    accountId: number
  ) {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const depositAccount = await accountRepository.findOneById(accountId);

    if (!depositAccount) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_NOT_FOUND);
    }
    if (!depositAccount.isParentType(ACCOUNT_PARENT_TYPE.CURRENT_ASSET)) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET);
    }
  }

  /**
   * Validate sale receipt number uniquiness on the storage.
   * @param {number} tenantId -
   * @param {string} receiptNumber -
   * @param {number} notReceiptId -
   */
  async validateReceiptNumberUnique(
    tenantId: number,
    receiptNumber: string,
    notReceiptId?: number
  ) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceipt = await SaleReceipt.query()
      .findOne('receipt_number', receiptNumber)
      .onBuild((builder) => {
        if (notReceiptId) {
          builder.whereNot('id', notReceiptId);
        }
      });

    if (saleReceipt) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_NUMBER_NOT_UNIQUE);
    }
  }

  /**
   * Validate the sale receipt number require.
   * @param {ISaleReceipt} saleReceipt
   */
  validateReceiptNoRequire(receiptNumber: string) {
    if (!receiptNumber) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_NO_IS_REQUIRED);
    }
  }

  /**
   * Retrieve the next unique receipt number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  getNextReceiptNumber(tenantId: number): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'sales_receipts'
    );
  }

  /**
   * Increment the receipt next number.
   * @param {number} tenantId -
   */
  incrementNextReceiptNumber(tenantId: number) {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'sales_receipts'
    );
  }

  /**
   * Transform create DTO object to model object.
   * @param   {ISaleReceiptDTO} saleReceiptDTO -
   * @param   {ISaleReceipt} oldSaleReceipt -
   * @returns {ISaleReceipt}
   */
  async transformDTOToModel(
    tenantId: number,
    saleReceiptDTO: ISaleReceiptDTO,
    paymentCustomer: ICustomer,
    oldSaleReceipt?: ISaleReceipt
  ): Promise<ISaleReceipt> {
    const amount = sumBy(saleReceiptDTO.entries, (e) =>
      ItemEntry.calcAmount(e)
    );
    // Retrieve the next invoice number.
    const autoNextNumber = this.getNextReceiptNumber(tenantId);

    // Retrieve the receipt number.
    const receiptNumber =
      saleReceiptDTO.receiptNumber ||
      oldSaleReceipt?.receiptNumber ||
      autoNextNumber;

    // Validate receipt number require.
    this.validateReceiptNoRequire(receiptNumber);

    const initialEntries = saleReceiptDTO.entries.map((entry) => ({
      reference_type: 'SaleReceipt',
      ...entry,
    }));

    const entries = await composeAsync(
      // Sets default cost and sell account to receipt items entries.
      this.itemsEntriesService.setItemsEntriesDefaultAccounts(tenantId)
    )(initialEntries);

    const initialDTO = {
      amount,
      ...formatDateFields(omit(saleReceiptDTO, ['closed', 'entries']), [
        'receiptDate',
      ]),
      currencyCode: paymentCustomer.currencyCode,
      exchangeRate: saleReceiptDTO.exchangeRate || 1,
      receiptNumber,
      // Avoid rewrite the deliver date in edit mode when already published.
      ...(saleReceiptDTO.closed &&
        !oldSaleReceipt?.closedAt && {
          closedAt: moment().toMySqlDateTime(),
        }),
      entries,
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<ISaleReceipt>(tenantId),
      this.warehouseDTOTransform.transformDTO<ISaleReceipt>(tenantId)
    )(initialDTO);
  }

  /**
   * Creates a new sale receipt with associated entries.
   * @async
   * @param {ISaleReceipt} saleReceipt
   * @return {Object}
   */
  public async createSaleReceipt(
    tenantId: number,
    saleReceiptDTO: any
  ): Promise<ISaleReceipt> {
    const { SaleReceipt, Contact } = this.tenancy.models(tenantId);

    // Retrieves the payment customer model.
    const paymentCustomer = await Contact.query()
      .modify('customer')
      .findById(saleReceiptDTO.customerId)
      .throwIfNotFound();

    // Transform sale receipt DTO to model.
    const saleReceiptObj = await this.transformDTOToModel(
      tenantId,
      saleReceiptDTO,
      paymentCustomer
    );
    // Validate receipt deposit account existence and type.
    await this.validateReceiptDepositAccountExistence(
      tenantId,
      saleReceiptDTO.depositAccountId
    );
    // Validate items IDs existence on the storage.
    await this.itemsEntriesService.validateItemsIdsExistence(
      tenantId,
      saleReceiptDTO.entries
    );
    // Validate the sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      saleReceiptDTO.entries
    );
    // Validate sale receipt number uniuqiness.
    if (saleReceiptDTO.receiptNumber) {
      await this.validateReceiptNumberUnique(
        tenantId,
        saleReceiptDTO.receiptNumber
      );
    }
    // Creates a sale receipt transaction and associated transactions under UOW env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleReceiptCreating` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onCreating, {
        saleReceiptDTO,
        tenantId,
        trx,
      } as ISaleReceiptCreatingPayload);

      // Inserts the sale receipt graph to the storage.
      const saleReceipt = await SaleReceipt.query().upsertGraph({
        ...saleReceiptObj,
      });
      // Triggers `onSaleReceiptCreated` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onCreated, {
        tenantId,
        saleReceipt,
        saleReceiptId: saleReceipt.id,
        trx,
      } as ISaleReceiptCreatedPayload);

      return saleReceipt;
    });
  }

  /**
   * Edit details sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @param {ISaleReceipt} saleReceipt
   * @return {void}
   */
  public async editSaleReceipt(
    tenantId: number,
    saleReceiptId: number,
    saleReceiptDTO: any
  ) {
    const { SaleReceipt, Contact } = this.tenancy.models(tenantId);

    // Retrieve sale receipt or throw not found service error.
    const oldSaleReceipt = await this.getSaleReceiptOrThrowError(
      tenantId,
      saleReceiptId
    );
    // Retrieves the payment customer model.
    const paymentCustomer = await Contact.query()
      .findById(saleReceiptId)
      .modify('customer')
      .throwIfNotFound();

    // Transform sale receipt DTO to model.
    const saleReceiptObj = await this.transformDTOToModel(
      tenantId,
      saleReceiptDTO,
      paymentCustomer,
      oldSaleReceipt
    );
    // Validate receipt deposit account existence and type.
    await this.validateReceiptDepositAccountExistence(
      tenantId,
      saleReceiptDTO.depositAccountId
    );
    // Validate items IDs existence on the storage.
    await this.itemsEntriesService.validateItemsIdsExistence(
      tenantId,
      saleReceiptDTO.entries
    );
    // Validate the sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      saleReceiptDTO.entries
    );
    // Validate sale receipt number uniuqiness.
    if (saleReceiptDTO.receiptNumber) {
      await this.validateReceiptNumberUnique(
        tenantId,
        saleReceiptDTO.receiptNumber,
        saleReceiptId
      );
    }
    // Edits the sale receipt transactions with associated transactions under UOW env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleReceiptsEditing` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onEditing, {
        tenantId,
        oldSaleReceipt,
        saleReceiptDTO,
        trx,
      } as ISaleReceiptEditingPayload);

      // Upsert the receipt graph to the storage.
      const saleReceipt = await SaleReceipt.query(trx).upsertGraphAndFetch({
        id: saleReceiptId,
        ...saleReceiptObj,
      });
      // Triggers `onSaleReceiptEdited` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onEdited, {
        tenantId,
        oldSaleReceipt,
        saleReceipt,
        saleReceiptId,
        trx,
      } as ISaleReceiptEditedPayload);

      return saleReceipt;
    });
  }

  /**
   * Deletes the sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {void}
   */
  public async deleteSaleReceipt(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt, ItemEntry } = this.tenancy.models(tenantId);

    const oldSaleReceipt = await this.getSaleReceiptOrThrowError(
      tenantId,
      saleReceiptId
    );
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers  `onSaleReceiptsDeleting` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onDeleting, {
        trx,
        oldSaleReceipt,
        tenantId,
      } as ISaleReceiptDeletingPayload);

      //
      await ItemEntry.query(trx)
        .where('reference_id', saleReceiptId)
        .where('reference_type', 'SaleReceipt')
        .delete();

      // Delete the sale receipt transaction.
      await SaleReceipt.query(trx).where('id', saleReceiptId).delete();

      // Triggers `onSaleReceiptsDeleted` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onDeleted, {
        tenantId,
        saleReceiptId,
        oldSaleReceipt,
        trx,
      } as ISaleReceiptEventDeletedPayload);
    });
  }

  /**
   * Retrieve sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @return {ISaleReceipt}
   */
  async getSaleReceipt(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('depositAccount')
      .withGraphFetched('branch');

    if (!saleReceipt) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_NOT_FOUND);
    }
    return this.transformer.transform(
      tenantId,
      saleReceipt,
      new SaleReceiptTransformer()
    );
  }

  /**
   * Parses the sale receipts list filter DTO.
   * @param filterDTO
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve sales receipts paginated and filterable list.
   * @param {number} tenantId
   * @param {ISaleReceiptFilter} salesReceiptsFilter
   */
  public async salesReceiptsList(
    tenantId: number,
    filterDTO: ISaleReceiptFilter
  ): Promise<{
    data: ISaleReceipt[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    // Parses the stringified filter roles.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      SaleReceipt,
      filter
    );
    const { results, pagination } = await SaleReceipt.query()
      .onBuild((builder) => {
        builder.withGraphFetched('depositAccount');
        builder.withGraphFetched('customer');
        builder.withGraphFetched('entries');

        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the estimates models to POJO.
    const salesEstimates = await this.transformer.transform(
      tenantId,
      results,
      new SaleReceiptTransformer()
    );
    return {
      data: salesEstimates,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Mark the given sale receipt as closed.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @return {Promise<void>}
   */
  async closeSaleReceipt(
    tenantId: number,
    saleReceiptId: number
  ): Promise<void> {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    // Retrieve sale receipt or throw not found service error.
    const oldSaleReceipt = await this.getSaleReceiptOrThrowError(
      tenantId,
      saleReceiptId
    );

    // Throw service error if the sale receipt already closed.
    if (oldSaleReceipt.isClosed) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_IS_ALREADY_CLOSED);
    }
    // Updates the sale recept transaction under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleReceiptClosing` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onClosing, {
        tenantId,
        oldSaleReceipt,
        trx,
      } as ISaleReceiptEventClosingPayload);

      // Mark the sale receipt as closed on the storage.
      const saleReceipt = await SaleReceipt.query(trx)
        .findById(saleReceiptId)
        .patch({
          closedAt: moment().toMySqlDateTime(),
        });

      // Triggers `onSaleReceiptClosed` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onClosed, {
        saleReceiptId,
        saleReceipt,
        tenantId,
        trx,
      } as ISaleReceiptEventClosedPayload);
    });
  }
  /**
   * Records the inventory transactions from the given bill input.
   * @param {Bill} bill - Bill model object.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async recordInventoryTransactions(
    tenantId: number,
    saleReceipt: ISaleReceipt,
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        tenantId,
        saleReceipt.entries
      );
    const transaction = {
      transactionId: saleReceipt.id,
      transactionType: 'SaleReceipt',
      transactionNumber: saleReceipt.receiptNumber,
      exchangeRate: saleReceipt.exchangeRate,

      date: saleReceipt.receiptDate,
      direction: 'OUT',
      entries: inventoryEntries,
      createdAt: saleReceipt.createdAt,

      warehouseId: saleReceipt.warehouseId,
    };
    return this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      tenantId,
      transaction,
      override,
      trx
    );
  }

  /**
   * Reverts the inventory transactions of the given bill id.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async revertInventoryTransactions(
    tenantId: number,
    receiptId: number,
    trx?: Knex.Transaction
  ) {
    return this.inventoryService.deleteInventoryTransactions(
      tenantId,
      receiptId,
      'SaleReceipt',
      trx
    );
  }

  /**
   * Validate the given customer has no sales receipts.
   * @param {number} tenantId
   * @param {number} customerId - Customer id.
   */
  public async validateCustomerHasNoReceipts(
    tenantId: number,
    customerId: number
  ) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const receipts = await SaleReceipt.query().where('customer_id', customerId);

    if (receipts.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_SALES_INVOICES);
    }
  }
}
