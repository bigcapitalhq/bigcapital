import { omit, sumBy } from 'lodash';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { Knex } from 'knex';
import composeAsync from 'async/compose';
import events from '@/subscribers/events';
import InventoryService from '@/services/Inventory/Inventory';
import SalesInvoicesCost from '@/services/Sales/SalesInvoicesCost';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { formatDateFields, transformToMap } from 'utils';
import {
  IBillDTO,
  IBill,
  ISystemUser,
  IBillEditDTO,
  IPaginationMeta,
  IFilterMeta,
  IBillsFilter,
  IBillsService,
  IItemEntry,
  IItemEntryDTO,
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
  IBillEventDeletingPayload,
  IBillEditingPayload,
  IBillCreatingPayload,
  IVendor,
} from '@/interfaces';
import { ServiceError } from '@/exceptions';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import { ERRORS } from './constants';
import EntriesService from '@/services/Entries';
import { PurchaseInvoiceTransformer } from './PurchaseInvoices/PurchaseInvoiceTransformer';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

/**
 * Vendor bills services.
 * @service
 */
@Service('Bills')
export default class BillsService
  extends SalesInvoicesCost
  implements IBillsService
{
  @Inject()
  inventoryService: InventoryService;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject('logger')
  logger: any;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  @Inject()
  journalPosterService: JournalPosterService;

  @Inject()
  entriesService: EntriesService;

  @Inject()
  transformer: TransformerInjectable;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  /**
   * Validates the given bill existence.
   * @async
   * @param {number} tenantId -
   * @param {number} billId -
   */
  public async getBillOrThrowError(tenantId: number, billId: number) {
    const { Bill } = this.tenancy.models(tenantId);

    const foundBill = await Bill.query()
      .findById(billId)
      .withGraphFetched('entries');

    if (!foundBill) {
      throw new ServiceError(ERRORS.BILL_NOT_FOUND);
    }
    return foundBill;
  }

  /**
   * Validates the bill number existence.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  private async validateBillNumberExists(
    tenantId: number,
    billNumber: string,
    notBillId?: number
  ) {
    const { Bill } = this.tenancy.models(tenantId);
    const foundBills = await Bill.query()
      .where('bill_number', billNumber)
      .onBuild((builder) => {
        if (notBillId) {
          builder.whereNot('id', notBillId);
        }
      });

    if (foundBills.length > 0) {
      throw new ServiceError(ERRORS.BILL_NUMBER_EXISTS);
    }
  }

  /**
   * Validate the bill has no payment entries.
   * @param {number} tenantId
   * @param {number} billId - Bill id.
   */
  private async validateBillHasNoEntries(tenantId, billId: number) {
    const { BillPaymentEntry } = this.tenancy.models(tenantId);

    // Retireve the bill associate payment made entries.
    const entries = await BillPaymentEntry.query().where('bill_id', billId);

    if (entries.length > 0) {
      throw new ServiceError(ERRORS.BILL_HAS_ASSOCIATED_PAYMENT_ENTRIES);
    }
    return entries;
  }

  /**
   * Validate the bill number require.
   * @param {string} billNo -
   */
  private validateBillNoRequire(billNo: string) {
    if (!billNo) {
      throw new ServiceError(ERRORS.BILL_NO_IS_REQUIRED);
    }
  }

  /**
   * Validate bill transaction has no associated allocated landed cost transactions.
   * @param {number} tenantId
   * @param {number} billId
   */
  private async validateBillHasNoLandedCost(tenantId: number, billId: number) {
    const { BillLandedCost } = this.tenancy.models(tenantId);

    const billLandedCosts = await BillLandedCost.query().where(
      'billId',
      billId
    );
    if (billLandedCosts.length > 0) {
      throw new ServiceError(ERRORS.BILL_HAS_ASSOCIATED_LANDED_COSTS);
    }
  }

  /**
   * Validate transaction entries that have landed cost type should not be
   * inventory items.
   * @param {number} tenantId -
   * @param {IItemEntryDTO[]} newEntriesDTO -
   */
  public async validateCostEntriesShouldBeInventoryItems(
    tenantId: number,
    newEntriesDTO: IItemEntryDTO[]
  ) {
    const { Item } = this.tenancy.models(tenantId);

    const entriesItemsIds = newEntriesDTO.map((e) => e.itemId);
    const entriesItems = await Item.query().whereIn('id', entriesItemsIds);

    const entriesItemsById = transformToMap(entriesItems, 'id');

    // Filter the landed cost entries that not associated with inventory item.
    const nonInventoryHasCost = newEntriesDTO.filter((entry) => {
      const item = entriesItemsById.get(entry.itemId);

      return entry.landedCost && item.type !== 'inventory';
    });
    if (nonInventoryHasCost.length > 0) {
      throw new ServiceError(
        ERRORS.LANDED_COST_ENTRIES_SHOULD_BE_INVENTORY_ITEMS
      );
    }
  }

  /**
   * Sets the default cost account to the bill entries.
   */
  private setBillEntriesDefaultAccounts(tenantId: number) {
    return async (entries: IItemEntry[]) => {
      const { Item } = this.tenancy.models(tenantId);

      const entriesItemsIds = entries.map((e) => e.itemId);
      const items = await Item.query().whereIn('id', entriesItemsIds);

      return entries.map((entry) => {
        const item = items.find((i) => i.id === entry.itemId);

        return {
          ...entry,
          ...(item.type !== 'inventory' && {
            costAccountId: entry.costAccountId || item.costAccountId,
          }),
        };
      });
    };
  }

  /**
   * Retrieve the bill entries total.
   * @param {IItemEntry[]} entries
   * @returns {number}
   */
  private getBillEntriesTotal(tenantId: number, entries: IItemEntry[]): number {
    const { ItemEntry } = this.tenancy.models(tenantId);

    return sumBy(entries, (e) => ItemEntry.calcAmount(e));
  }

  /**
   * Retrieve the bill landed cost amount.
   * @param {IBillDTO} billDTO
   * @returns {number}
   */
  private getBillLandedCostAmount(tenantId: number, billDTO: IBillDTO): number {
    const costEntries = billDTO.entries.filter((entry) => entry.landedCost);

    return this.getBillEntriesTotal(tenantId, costEntries);
  }

  /**
   * Converts create bill DTO to model.
   * @param   {number} tenantId
   * @param   {IBillDTO} billDTO
   * @param   {IBill} oldBill
   * @returns {IBill}
   */
  private async billDTOToModel(
    tenantId: number,
    billDTO: IBillDTO,
    vendor: IVendor,
    authorizedUser: ISystemUser,
    oldBill?: IBill
  ) {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const amount = sumBy(billDTO.entries, (e) => ItemEntry.calcAmount(e));

    // Retrieve the landed cost amount from landed cost entries.
    const landedCostAmount = this.getBillLandedCostAmount(tenantId, billDTO);

    // Bill number from DTO or from auto-increment.
    const billNumber = billDTO.billNumber || oldBill?.billNumber;

    const initialEntries = billDTO.entries.map((entry) => ({
      reference_type: 'Bill',
      ...omit(entry, ['amount']),
    }));
    const entries = await composeAsync(
      // Sets the default cost account to the bill entries.
      this.setBillEntriesDefaultAccounts(tenantId)
    )(initialEntries);

    const initialDTO = {
      ...formatDateFields(omit(billDTO, ['open', 'entries']), [
        'billDate',
        'dueDate',
      ]),
      amount,
      landedCostAmount,
      currencyCode: vendor.currencyCode,
      exchangeRate: billDTO.exchangeRate || 1,
      billNumber,
      entries,
      // Avoid rewrite the open date in edit mode when already opened.
      ...(billDTO.open &&
        !oldBill?.openedAt && {
          openedAt: moment().toMySqlDateTime(),
        }),
      userId: authorizedUser.id,
    };
    return R.compose(
      this.branchDTOTransform.transformDTO(tenantId),
      this.warehouseDTOTransform.transformDTO(tenantId)
    )(initialDTO);
  }

  /**
   * Creates a new bill and stored it to the storage.
   * ----
   * Precedures.
   * ----
   * - Insert bill transactions to the storage.
   * - Insert bill entries to the storage.
   * - Increment the given vendor id.
   * - Record bill journal transactions on the given accounts.
   * - Record bill items inventory transactions.
   * ----
   * @param  {number} tenantId - The given tenant id.
   * @param  {IBillDTO} billDTO -
   * @return {Promise<IBill>}
   */
  public async createBill(
    tenantId: number,
    billDTO: IBillDTO,
    authorizedUser: ISystemUser
  ): Promise<IBill> {
    const { Bill, Contact } = this.tenancy.models(tenantId);

    // Retrieves the given bill vendor or throw not found error.
    const vendor = await Contact.query()
      .modify('vendor')
      .findById(billDTO.vendorId)
      .throwIfNotFound();

    // Validate the bill number uniqiness on the storage.
    await this.validateBillNumberExists(tenantId, billDTO.billNumber);

    // Validate items IDs existence.
    await this.itemsEntriesService.validateItemsIdsExistence(
      tenantId,
      billDTO.entries
    );
    // Validate non-purchasable items.
    await this.itemsEntriesService.validateNonPurchasableEntriesItems(
      tenantId,
      billDTO.entries
    );
    // Validates the cost entries should be with inventory items.
    await this.validateCostEntriesShouldBeInventoryItems(
      tenantId,
      billDTO.entries
    );
    // Transform the bill DTO to model object.
    const billObj = await this.billDTOToModel(
      tenantId,
      billDTO,
      vendor,
      authorizedUser
    );
    // Write new bill transaction with associated transactions under UOW env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillCreating` event.
      await this.eventPublisher.emitAsync(events.bill.onCreating, {
        trx,
        billDTO,
        tenantId,
      } as IBillCreatingPayload);

      // Inserts the bill graph object to the storage.
      const bill = await Bill.query(trx).upsertGraph(billObj);

      // Triggers `onBillCreated` event.
      await this.eventPublisher.emitAsync(events.bill.onCreated, {
        tenantId,
        bill,
        billId: bill.id,
        trx,
      } as IBillCreatedPayload);

      return bill;
    });
  }

  /**
   * Edits details of the given bill id with associated entries.
   *
   * Precedures:
   * -------
   * - Update the bill transaction on the storage.
   * - Update the bill entries on the storage and insert the not have id and delete
   *   once that not presented.
   * - Increment the diff amount on the given vendor id.
   * - Re-write the inventory transactions.
   * - Re-write the bill journal transactions.
   * ------
   * @param {number} tenantId - The given tenant id.
   * @param {Integer} billId - The given bill id.
   * @param {IBillEditDTO} billDTO - The given new bill details.
   * @return {Promise<IBill>}
   */
  public async editBill(
    tenantId: number,
    billId: number,
    billDTO: IBillEditDTO,
    authorizedUser: ISystemUser
  ): Promise<IBill> {
    const { Bill, Contact } = this.tenancy.models(tenantId);

    const oldBill = await this.getBillOrThrowError(tenantId, billId);

    // Retrieve vendor details or throw not found service error.
    const vendor = await Contact.query()
      .findById(billDTO.vendorId)
      .modify('vendor')
      .throwIfNotFound();

    // Validate bill number uniqiness on the storage.
    if (billDTO.billNumber) {
      await this.validateBillNumberExists(tenantId, billDTO.billNumber, billId);
    }
    // Validate the entries ids existence.
    await this.itemsEntriesService.validateEntriesIdsExistence(
      tenantId,
      billId,
      'Bill',
      billDTO.entries
    );
    // Validate the items ids existence on the storage.
    await this.itemsEntriesService.validateItemsIdsExistence(
      tenantId,
      billDTO.entries
    );
    // Accept the purchasable items only.
    await this.itemsEntriesService.validateNonPurchasableEntriesItems(
      tenantId,
      billDTO.entries
    );
    // Transforms the bill DTO to model object.
    const billObj = await this.billDTOToModel(
      tenantId,
      billDTO,
      vendor,
      authorizedUser,
      oldBill
    );
    // Validate landed cost entries that have allocated cost could not be deleted.
    await this.entriesService.validateLandedCostEntriesNotDeleted(
      oldBill.entries,
      billObj.entries
    );
    // Validate new landed cost entries should be bigger than new entries.
    await this.entriesService.validateLocatedCostEntriesSmallerThanNewEntries(
      oldBill.entries,
      billObj.entries
    );
    // Edits bill transactions and associated transactions under UOW environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillEditing` event.
      await this.eventPublisher.emitAsync(events.bill.onEditing, {
        trx,
        tenantId,
        oldBill,
        billDTO,
      } as IBillEditingPayload);

      // Update the bill transaction.
      const bill = await Bill.query(trx).upsertGraph({
        id: billId,
        ...billObj,
      });
      // Triggers event `onBillEdited`.
      await this.eventPublisher.emitAsync(events.bill.onEdited, {
        tenantId,
        billId,
        oldBill,
        bill,
        trx,
      } as IBillEditedPayload);

      return bill;
    });
  }

  /**
   * Deletes the bill with associated entries.
   * @param {Integer} billId
   * @return {void}
   */
  public async deleteBill(tenantId: number, billId: number) {
    const { ItemEntry, Bill } = this.tenancy.models(tenantId);

    // Retrieve the given bill or throw not found error.
    const oldBill = await this.getBillOrThrowError(tenantId, billId);

    // Validate the givne bill has no associated landed cost transactions.
    await this.validateBillHasNoLandedCost(tenantId, billId);

    // Validate the purchase bill has no associated payments transactions.
    await this.validateBillHasNoEntries(tenantId, billId);

    // Validate the given bill has no associated reconciled with vendor credits.
    await this.validateBillHasNoAppliedToCredit(tenantId, billId);

    // Deletes bill transaction with associated transactions under
    // unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillDeleting` event.
      await this.eventPublisher.emitAsync(events.bill.onDeleting, {
        trx,
        tenantId,
        oldBill,
      } as IBillEventDeletingPayload);

      // Delete all associated bill entries.
      await ItemEntry.query(trx)
        .where('reference_type', 'Bill')
        .where('reference_id', billId)
        .delete();

      // Delete the bill transaction.
      await Bill.query(trx).findById(billId).delete();

      // Triggers `onBillDeleted` event.
      await this.eventPublisher.emitAsync(events.bill.onDeleted, {
        tenantId,
        billId,
        oldBill,
        trx,
      } as IBIllEventDeletedPayload);
    });
  }

  validateBillHasNoAppliedToCredit = async (
    tenantId: number,
    billId: number
  ) => {
    const { VendorCreditAppliedBill } = this.tenancy.models(tenantId);

    const appliedTransactions = await VendorCreditAppliedBill.query().where(
      'billId',
      billId
    );
    if (appliedTransactions.length > 0) {
      throw new ServiceError(ERRORS.BILL_HAS_APPLIED_TO_VENDOR_CREDIT);
    }
  };

  /**
   * Parses bills list filter DTO.
   * @param filterDTO -
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve bills data table list.
   * @param {number} tenantId -
   * @param {IBillsFilter} billsFilter -
   */
  public async getBills(
    tenantId: number,
    filterDTO: IBillsFilter
  ): Promise<{
    bills: IBill;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { Bill } = this.tenancy.models(tenantId);

    // Parses bills list filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      Bill,
      filter
    );
    const { results, pagination } = await Bill.query()
      .onBuild((builder) => {
        builder.withGraphFetched('vendor');
        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Tranform the bills to POJO.
    const bills = await this.transformer.transform(
      tenantId,
      results,
      new PurchaseInvoiceTransformer()
    );
    return {
      bills,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Retrieve all due bills or for specific given vendor id.
   * @param {number} tenantId -
   * @param {number} vendorId -
   */
  public async getDueBills(
    tenantId: number,
    vendorId?: number
  ): Promise<IBill[]> {
    const { Bill } = this.tenancy.models(tenantId);

    const dueBills = await Bill.query().onBuild((query) => {
      query.orderBy('bill_date', 'DESC');
      query.modify('dueBills');

      if (vendorId) {
        query.where('vendor_id', vendorId);
      }
    });
    return dueBills;
  }

  /**
   * Retrieve the given bill details with associated items entries.
   * @param {Integer} billId - Specific bill.
   * @returns {Promise<IBill>}
   */
  public async getBill(tenantId: number, billId: number): Promise<IBill> {
    const { Bill } = this.tenancy.models(tenantId);

    const bill = await Bill.query()
      .findById(billId)
      .withGraphFetched('vendor')
      .withGraphFetched('entries.item')
      .withGraphFetched('branch');

    if (!bill) {
      throw new ServiceError(ERRORS.BILL_NOT_FOUND);
    }
    return this.transformer.transform(
      tenantId,
      bill,
      new PurchaseInvoiceTransformer()
    );
  }

  /**
   * Mark the bill as open.
   * @param {number} tenantId
   * @param {number} billId
   */
  public async openBill(tenantId: number, billId: number): Promise<void> {
    const { Bill } = this.tenancy.models(tenantId);

    // Retrieve the given bill or throw not found error.
    const oldBill = await this.getBillOrThrowError(tenantId, billId);

    if (oldBill.isOpen) {
      throw new ServiceError(ERRORS.BILL_ALREADY_OPEN);
    }
    //
    return this.uow.withTransaction(tenantId, async (trx) => {
      // Record the bill opened at on the storage.
      await Bill.query(trx).findById(billId).patch({
        openedAt: moment().toMySqlDateTime(),
      });
    });
  }

  /**
   * Records the inventory transactions from the given bill input.
   * @param  {Bill} bill - Bill model object.
   * @param  {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async recordInventoryTransactions(
    tenantId: number,
    billId: number,
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { Bill } = this.tenancy.models(tenantId);

    // Retireve bill with associated entries and allocated cost entries.
    const bill = await Bill.query(trx)
      .findById(billId)
      .withGraphFetched('entries.allocatedCostEntries');

    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        tenantId,
        bill.entries
      );
    const transaction = {
      transactionId: bill.id,
      transactionType: 'Bill',
      exchangeRate: bill.exchangeRate,

      date: bill.billDate,
      direction: 'IN',
      entries: inventoryEntries,
      createdAt: bill.createdAt,

      warehouseId: bill.warehouseId,
    };
    await this.inventoryService.recordInventoryTransactionsFromItemsEntries(
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
    billId: number,
    trx?: Knex.Transaction
  ) {
    // Deletes the inventory transactions by the given reference id and type.
    await this.inventoryService.deleteInventoryTransactions(
      tenantId,
      billId,
      'Bill',
      trx
    );
  }

  /**
   * Validate the given vendor has no associated bills transactions.
   * @param {number} tenantId
   * @param {number} vendorId - Vendor id.
   */
  public async validateVendorHasNoBills(tenantId: number, vendorId: number) {
    const { Bill } = this.tenancy.models(tenantId);

    const bills = await Bill.query().where('vendor_id', vendorId);

    if (bills.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_HAS_BILLS);
    }
  }
}
