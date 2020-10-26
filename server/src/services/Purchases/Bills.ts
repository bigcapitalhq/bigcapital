import { omit, sumBy, pick, difference } from 'lodash';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import events from 'subscribers/events';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalEntry from 'services/Accounting/JournalEntry';
import AccountsService from 'services/Accounts/AccountsService';
import InventoryService from 'services/Inventory/Inventory';
import SalesInvoicesCost from 'services/Sales/SalesInvoicesCost';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { formatDateFields } from 'utils';
import {
  IBillDTO,
  IBill,
  IItem,
  ISystemUser,
  IBillEditDTO,
  IPaginationMeta,
  IFilterMeta,
  IBillsFilter,
} from 'interfaces';
import { ServiceError } from 'exceptions';
import ItemsService from 'services/Items/ItemsService';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';

const ERRORS = {
  BILL_NOT_FOUND: 'BILL_NOT_FOUND',
  BILL_VENDOR_NOT_FOUND: 'BILL_VENDOR_NOT_FOUND',
  BILL_ITEMS_NOT_PURCHASABLE: 'BILL_ITEMS_NOT_PURCHASABLE',
  BILL_NUMBER_EXISTS: 'BILL_NUMBER_EXISTS',
  BILL_ITEMS_NOT_FOUND: 'BILL_ITEMS_NOT_FOUND',
  BILL_ENTRIES_IDS_NOT_FOUND: 'BILL_ENTRIES_IDS_NOT_FOUND',
  NOT_PURCHASE_ABLE_ITEMS: 'NOT_PURCHASE_ABLE_ITEMS',
};

/**
 * Vendor bills services.
 * @service
 */
@Service()
export default class BillsService extends SalesInvoicesCost {
  @Inject()
  inventoryService: InventoryService;

  @Inject()
  accountsService: AccountsService;

  @Inject()
  itemsService: ItemsService;

  @Inject()
  tenancy: TenancyService;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject('logger')
  logger: any;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  /**
   * Validates whether the vendor is exist.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  private async getVendorOrThrowError(tenantId: number, vendorId: number) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[bill] trying to get vendor.', { tenantId, vendorId });
    const foundVendor = await vendorRepository.findById(vendorId);

    if (!foundVendor) {
      this.logger.info('[bill] the given vendor not found.', { tenantId, vendorId });
      throw new ServiceError(ERRORS.BILL_VENDOR_NOT_FOUND);
    }
    return foundVendor;
  }

  /**
   * Validates the given bill existance.
   * @async
   * @param {number} tenantId -
   * @param {number} billId - 
   */
  private async getBillOrThrowError(tenantId: number, billId: number) {
    const { Bill } = this.tenancy.models(tenantId);

    this.logger.info('[bill] trying to get bill.', { tenantId, billId });
    const foundBill = await Bill.query().findById(billId).withGraphFetched('entries');

    if (!foundBill) {
      this.logger.info('[bill] the given bill not found.', { tenantId, billId });
      throw new ServiceError(ERRORS.BILL_NOT_FOUND);
    }
    return foundBill;
  }

  /**
   * Validates the bill number existance.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  private async validateBillNumberExists(tenantId: number, billNumber: string, notBillId?: number) {
    const { Bill } = this.tenancy.models(tenantId);
    const foundBills = await Bill.query().where('bill_number', billNumber).onBuild((builder) => {
      if (notBillId) {
        builder.whereNot('id', notBillId);
      }
    });

    if (foundBills.length > 0) {
      throw new ServiceError(ERRORS.BILL_NUMBER_EXISTS);
    }
  }

  /**
   * Converts bill DTO to model.
   * @param {number} tenantId 
   * @param {IBillDTO} billDTO 
   * @param {IBill} oldBill 
   * 
   * @returns {IBill}
   */
  private async billDTOToModel(tenantId: number, billDTO: IBillDTO|IBillEditDTO, oldBill?: IBill) {
    const { ItemEntry } = this.tenancy.models(tenantId);
    let invLotNumber = oldBill?.invLotNumber;

    // if (!invLotNumber) {
    //   invLotNumber = await this.inventoryService.nextLotNumber(tenantId);
    // }
    const entries = billDTO.entries.map((entry) => ({
      ...entry,
      amount: ItemEntry.calcAmount(entry),
    }));
    const amount = sumBy(entries, 'amount');

    return {
      ...formatDateFields(billDTO, ['bill_date', 'due_date']),
      amount,
      invLotNumber,
      entries,
    };
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
    const { Bill } = this.tenancy.models(tenantId);

    this.logger.info('[bill] trying to create a new bill', { tenantId, billDTO });
    const billObj = await this.billDTOToModel(tenantId, billDTO);

    // Retrieve vendor or throw not found service error.
    await this.getVendorOrThrowError(tenantId, billDTO.vendorId);

    // Validate the bill number uniqiness on the storage.
    if (billDTO.billNumber) {
      await this.validateBillNumberExists(tenantId, billDTO.billNumber);
    }
    // Validate items IDs existance.
    await this.itemsEntriesService.validateItemsIdsExistance(tenantId, billDTO.entries);

    // Validate non-purchasable items.
    await this.itemsEntriesService.validateNonPurchasableEntriesItems(tenantId, billDTO.entries);

    const bill = await Bill.query()
      .insertGraph({
        ...omit(billObj, ['entries']),
        userId: authorizedUser.id,
        entries: billDTO.entries.map((entry) => ({
          reference_type: 'Bill',
          ...omit(entry, ['amount', 'id']),
        })),
      });

    // Triggers `onBillCreated` event. 
    await this.eventDispatcher.dispatch(events.bill.onCreated, {
      tenantId, bill, billId: bill.id,
    });
    this.logger.info('[bill] bill inserted successfully.', { tenantId, billId: bill.id });

    return bill;
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
   *
   * @param {number} tenantId - The given tenant id.
   * @param {Integer} billId - The given bill id.
   * @param {IBillEditDTO} billDTO - The given new bill details.
   * @return {Promise<IBill>}
   */
  public async editBill(
    tenantId: number,
    billId: number,
    billDTO: IBillEditDTO,
  ): Promise<IBill> {
    const { Bill } = this.tenancy.models(tenantId);

    this.logger.info('[bill] trying to edit bill.', { tenantId, billId });
    const oldBill = await this.getBillOrThrowError(tenantId, billId);
    const billObj = await this.billDTOToModel(tenantId, billDTO, oldBill);

    // Retrieve vendor details or throw not found service error.
    await this.getVendorOrThrowError(tenantId, billDTO.vendorId);

    // Validate bill number uniqiness on the storage.
    if (billDTO.billNumber) {
      await this.validateBillNumberExists(tenantId, billDTO.billNumber, billId);
    }
    await this.itemsEntriesService.validateEntriesIdsExistance(tenantId, billId, 'Bill', billDTO.entries);
    await this.itemsEntriesService.validateItemsIdsExistance(tenantId, billDTO.entries);
    await this.itemsEntriesService.validateNonPurchasableEntriesItems(tenantId, billDTO.entries);

    // Update the bill transaction.
    const bill = await Bill.query().upsertGraphAndFetch({
      id: billId,
      ...omit(billObj, ['entries', 'invLotNumber']),

      entries: billDTO.entries.map((entry) => ({
        reference_type: 'Bill',
        ...omit(entry, ['amount']),
      }))
    });
    // Triggers event `onBillEdited`.
    await this.eventDispatcher.dispatch(events.bill.onEdited, { tenantId, billId, oldBill, bill });
    this.logger.info('[bill] bill upserted successfully.', { tenantId, billId });

    return bill;
  }

  /**
   * Deletes the bill with associated entries.
   * @param {Integer} billId
   * @return {void}
   */
  public async deleteBill(tenantId: number, billId: number) {
    const { Bill, ItemEntry } = this.tenancy.models(tenantId);

    const oldBill = await this.getBillOrThrowError(tenantId, billId);

    // Delete all associated bill entries.
    const deleteBillEntriesOper = ItemEntry.query()
      .where('reference_type', 'Bill')
      .where('reference_id', billId)
      .delete();

    // Delete the bill transaction.
    const deleteBillOper = Bill.query().where('id', billId).delete();

    await Promise.all([deleteBillEntriesOper, deleteBillOper]);

    // Triggers `onBillDeleted` event.
    await this.eventDispatcher.dispatch(events.bill.onDeleted, { tenantId, billId, oldBill });
  }

  /**
   * Records the inventory transactions from the given bill input.
   * @param {Bill} bill 
   * @param {number} billId 
   */
  public recordInventoryTransactions(
    tenantId: number,
    bill: any,
    billId: number,
    override?: boolean
  ) {
    const inventoryTransactions = bill.entries
      .map((entry) => ({
        ...pick(entry, ['item_id', 'quantity', 'rate']),
        lotNumber: bill.invLotNumber,
        transactionType: 'Bill',
        transactionId: billId,
        direction: 'IN',
        date: bill.bill_date,
        entryId: entry.id,
      }));

    return this.inventoryService.recordInventoryTransactions(
      tenantId, inventoryTransactions, override
    );
  }

  /**
   * Records the bill journal transactions.
   * @async
   * @param {IBill} bill
   * @param {Integer} billId
   */
  public async recordJournalTransactions(tenantId: number, bill: IBill, billId?: number) {
    const { AccountTransaction, Item, ItemEntry } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const entriesItemsIds = bill.entries.map((entry) => entry.itemId);
    const formattedDate = moment(bill.billDate).format('YYYY-MM-DD');

    const storedItems = await Item.query().whereIn('id', entriesItemsIds);

    const storedItemsMap = new Map(storedItems.map((item) => [item.id, item]));
    const payableAccount = await accountRepository.getBySlug('accounts-payable');

    const journal = new JournalPoster(tenantId);

    const commonJournalMeta = {
      debit: 0,
      credit: 0,
      referenceId: bill.id,
      referenceType: 'Bill',
      date: formattedDate,
      userId: bill.userId,
    };
    if (billId) {
      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['Bill'])
        .whereIn('reference_id', [billId])
        .withGraphFetched('account.type');

      journal.loadEntries(transactions);
      journal.removeEntries();
    }
    const payableEntry = new JournalEntry({
      ...commonJournalMeta,
      credit: bill.amount,
      account: payableAccount.id,
      contactId: bill.vendorId,
      contactType: 'Vendor',
      index: 1,
    });
    journal.credit(payableEntry);

    bill.entries.forEach((entry, index) => {
      const item: IItem = storedItemsMap.get(entry.itemId);
      const amount = ItemEntry.calcAmount(entry);

      const debitEntry = new JournalEntry({
        ...commonJournalMeta,
        debit: amount,
        account:
          ['inventory'].indexOf(item.type) !== -1
            ? item.inventoryAccountId
            : item.costAccountId,
        index: index + 2,
      });
      journal.debit(debitEntry);
    });
    return Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }

  /**
   * Retrieve bills data table list.
   * @param {number} tenantId -
   * @param {IBillsFilter} billsFilter -
   */
  public async getBills(
    tenantId: number,
    billsFilter: IBillsFilter,
  ): Promise<{ bills: IBill, pagination: IPaginationMeta, filterMeta: IFilterMeta }> {
    const { Bill } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(tenantId, Bill, billsFilter);

    this.logger.info('[bills] trying to get bills data table.', { tenantId, billsFilter });
    const { results, pagination } = await Bill.query().onBuild((builder) => {
      builder.withGraphFetched('vendor');
      dynamicFilter.buildQuery()(builder);
    }).pagination(billsFilter.page - 1, billsFilter.pageSize);

    return {
      bills: results,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Retrieve the given bill details with associated items entries.
   * @param {Integer} billId - Specific bill.
   * @returns {Promise<IBill>}
   */
  public async getBill(tenantId: number, billId: number): Promise<IBill> {
    const { Bill } = this.tenancy.models(tenantId);

    this.logger.info('[bills] trying to fetch specific bill with metadata.', { tenantId, billId });
    const bill = await Bill.query().findById(billId)
      .withGraphFetched('vendor')
      .withGraphFetched('entries');

    if (!bill) {
      throw new ServiceError(ERRORS.BILL_NOT_FOUND);
    }
    return bill;
  }

  /**
   * Schedules compute bill items cost based on each item cost method.
   * @param {number} tenantId -
   * @param {IBill} bill -
   * @return {Promise}
   */
  public async scheduleComputeBillItemsCost(tenantId: number, bill) {
    const { Item } = this.tenancy.models(tenantId);
    const billItemsIds = bill.entries.map((entry) => entry.item_id);

    // Retrieves inventory items only.
    const inventoryItems = await Item.query()
      .whereIn('id', billItemsIds)
      .where('type', 'inventory');

    const inventoryItemsIds = inventoryItems.map(i => i.id);

    if (inventoryItemsIds.length > 0) {      
      await this.scheduleComputeItemsCost(
        tenantId,
        inventoryItemsIds,
        bill.bill_date
      );
    }
  }
}