import { omit, sumBy, pick } from 'lodash';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import AccountsService from '@/services/Accounts/AccountsService';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import InventoryService from '@/services/Inventory/Inventory';
import HasItemsEntries from '@/services/Sales/HasItemsEntries';
import SalesInvoicesCost from '@/services/Sales/SalesInvoicesCost';
import TenancyService from '@/services/Tenancy/TenancyService';
import { formatDateFields } from '@/utils';
import{ IBillOTD, IBill, IItem } from '@/interfaces';

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
  tenancy: TenancyService;

  /**
   * Converts bill DTO to model.
   * @param {number} tenantId 
   * @param {IBillDTO} billDTO 
   * @param {IBill} oldBill 
   * 
   * @returns {IBill}
   */
  async billDTOToModel(tenantId: number, billDTO: IBillOTD, oldBill?: IBill) {
    const { ItemEntry } = this.tenancy.models(tenantId);
    let invLotNumber = oldBill?.invLotNumber;

    if (!invLotNumber) {
      invLotNumber = await this.inventoryService.nextLotNumber(tenantId);
    }
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
   *
   * Precedures.
   * ----
   * - Insert bill transactions to the storage.
   * - Insert bill entries to the storage.
   * - Increment the given vendor id.
   * - Record bill journal transactions on the given accounts.
   * - Record bill items inventory transactions.
   * ----
   * @param {number} tenantId - The given tenant id.
   * @param {IBillOTD} billDTO -
   * @return {void}
   */
  async createBill(tenantId: number, billDTO: IBillOTD) {
    const { Vendor, Bill, ItemEntry } = this.tenancy.models(tenantId);

    const bill = await this.billDTOToModel(tenantId, billDTO);
    const saveEntriesOpers = [];

    const storedBill = await Bill.query()
      .insert({
        ...omit(bill, ['entries']),
      });
    bill.entries.forEach((entry) => {
      const oper = ItemEntry.query()
        .insertAndFetch({
          reference_type: 'Bill',
          reference_id: storedBill.id,
          ...omit(entry, ['amount']),
        }).then((itemEntry) => {
          entry.id = itemEntry.id;
        });
      saveEntriesOpers.push(oper);
    });
    // Await save all bill entries operations.
    await Promise.all([...saveEntriesOpers]); 

    // Increments vendor balance.
    const incrementOper = Vendor.changeBalance(bill.vendor_id, bill.amount);

    // Rewrite the inventory transactions for inventory items.
    const writeInvTransactionsOper = this.recordInventoryTransactions(
      tenantId, bill, storedBill.id
    );
    // Writes the journal entries for the given bill transaction.
    const writeJEntriesOper = this.recordJournalTransactions(tenantId, {
      id: storedBill.id, ...bill,
    });
    await Promise.all([
      incrementOper,
      writeInvTransactionsOper,
      writeJEntriesOper,
    ]);
    // Schedule bill re-compute based on the item cost
    // method and starting date.
    await this.scheduleComputeBillItemsCost(tenantId, bill); 

    return storedBill;
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
   * @param {billDTO} billDTO - The given new bill details.
   */
  async editBill(tenantId: number, billId: number, billDTO: billDTO) {
    const { Bill, ItemEntry, Vendor } = this.tenancy.models(tenantId);
 
    const oldBill = await Bill.query().findById(billId);
    const bill = this.billDTOToModel(tenantId, billDTO, oldBill);

    // Update the bill transaction.
    const updatedBill = await Bill.query()
      .where('id', billId)
      .update({
        ...omit(bill, ['entries', 'invLotNumber'])
      });
    // Old stored entries.
    const storedEntries = await ItemEntry.query()
      .where('reference_id', billId)
      .where('reference_type', 'Bill');

    // Patch the bill entries.
    const patchEntriesOper = HasItemsEntries.patchItemsEntries(
      bill.entries, storedEntries, 'Bill', billId,
    );
    // Changes the diff vendor balance between old and new amount.
    const changeVendorBalanceOper = Vendor.changeDiffBalance(
      bill.vendor_id,
      oldBill.vendorId,
      bill.amount,
      oldBill.amount,
    );
    // Re-write the inventory transactions for inventory items.
    const writeInvTransactionsOper = this.recordInventoryTransactions(
      tenantId, bill, billId, true
    );
    // Writes the journal entries for the given bill transaction.
    const writeJEntriesOper = this.recordJournalTransactions(tenantId, {
      id: billId,
      ...bill,
    }, billId);

    await Promise.all([
      patchEntriesOper,
      changeVendorBalanceOper,
      writeInvTransactionsOper,
      writeJEntriesOper,
    ]);
    // Schedule sale invoice re-compute based on the item cost
    // method and starting date.
    await this.scheduleComputeBillItemsCost(tenantId, bill); 
  }

  /**
   * Deletes the bill with associated entries.
   * @param {Integer} billId
   * @return {void}
   */
  async deleteBill(tenantId: number, billId: number) {
    const { Bill, ItemEntry, Vendor } = this.tenancy.models(tenantId);

    const bill = await Bill.query()
      .where('id', billId)
      .withGraphFetched('entries')
      .first();

    // Delete all associated bill entries.
    const deleteBillEntriesOper = ItemEntry.query()
      .where('reference_type', 'Bill')
      .where('reference_id', billId)
      .delete();

    // Delete the bill transaction.
    const deleteBillOper = Bill.query().where('id', billId).delete();

    // Delete associated bill journal transactions.
    const deleteTransactionsOper = JournalPosterService.deleteJournalTransactions(
      billId,
      'Bill'
    );
    // Delete bill associated inventory transactions.
    const deleteInventoryTransOper = this.inventoryService.deleteInventoryTransactions(
      tenantId, billId, 'Bill'
    );
    // Revert vendor balance.
    const revertVendorBalance = Vendor.changeBalance(bill.vendorId, bill.amount * -1);
  
    await Promise.all([
      deleteBillOper,
      deleteBillEntriesOper,
      deleteTransactionsOper,
      deleteInventoryTransOper,
      revertVendorBalance,
    ]);
    // Schedule sale invoice re-compute based on the item cost
    // method and starting date.
    await this.scheduleComputeBillItemsCost(tenantId, bill); 
  }

  /**
   * Records the inventory transactions from the given bill input.
   * @param {Bill} bill 
   * @param {number} billId 
   */
  recordInventoryTransactions(
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
  async recordJournalTransactions(tenantId: number, bill: any, billId?: number) {
    const { AccountTransaction, Item } = this.tenancy.models(tenantId);

    const entriesItemsIds = bill.entries.map((entry) => entry.item_id);
    const payableTotal = sumBy(bill.entries, 'amount');
    const formattedDate = moment(bill.bill_date).format('YYYY-MM-DD');

    const storedItems = await Item.query()
      .whereIn('id', entriesItemsIds);

    const storedItemsMap = new Map(storedItems.map((item) => [item.id, item]));
    const payableAccount = await this.accountsService.getAccountByType(
      tenantId, 'accounts_payable'
    );
    const journal = new JournalPoster(tenantId);

    const commonJournalMeta = {
      debit: 0,
      credit: 0,
      referenceId: bill.id,
      referenceType: 'Bill',
      date: formattedDate,
      accural: true,
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
      credit: payableTotal,
      account: payableAccount.id,
      contactId: bill.vendor_id,
      contactType: 'Vendor',
    });
    journal.credit(payableEntry);

    bill.entries.forEach((entry) => {
      const item: IItem = storedItemsMap.get(entry.item_id);

      const debitEntry = new JournalEntry({
        ...commonJournalMeta,
        debit: entry.amount,
        account:
          ['inventory'].indexOf(item.type) !== -1
            ? item.inventoryAccountId
            : item.costAccountId,
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
   * Detarmines whether the bill exists on the storage.
   * @param {number} tenantId - The given tenant id.
   * @param {Integer} billId - The given bill id.
   * @return {Boolean}
   */
  async isBillExists(tenantId: number, billId: number) {
    const { Bill } = this.tenancy.models(tenantId);

    const foundBills = await Bill.query().where('id', billId);
    return foundBills.length > 0;
  }

  /**
   * Detarmines whether the given bills exist on the storage in bulk.
   * @param {Array} billsIds
   * @return {Boolean}
   */
  async isBillsExist(tenantId: number, billsIds: number[]) {
    const { Bill } = this.tenancy.models(tenantId);

    const bills = await Bill.query().whereIn('id', billsIds);
    return bills.length > 0;
  }

  /**
   * Detarmines whether the given bill id exists on the storage.
   * @param {number} tenantId 
   * @param {Integer} billNumber 
   * @return {boolean}
   */
  async isBillNoExists(tenantId: number, billNumber : string) {
    const { Bill } = this.tenancy.models(tenantId);

    const foundBills = await Bill.query()
      .where('bill_number', billNumber);
    return foundBills.length > 0;
  }

  /**
   * Retrieve the given bill details with associated items entries.
   * @param {Integer} billId -
   * @returns {Promise}
   */
  getBill(tenantId: number, billId: number) {
    const { Bill } = this.tenancy.models(tenantId);

    return Bill.query().where('id', billId).first();
  }

  /**
   * Retrieve the given bill details with associated items entries.
   * @param {Integer} billId -
   * @returns {Promise}
   */
  getBillWithMetadata(tenantId: number, billId: number) {
    const { Bill } = this.tenancy.models(tenantId);

    return Bill.query()
      .where('id', billId)
      .withGraphFetched('vendor')
      .withGraphFetched('entries')
      .first();
  }

  /**
   * Schedules compute bill items cost based on each item cost method.
   * @param {number} tenantId -
   * @param {IBill} bill -
   * @return {Promise}
   */
  async scheduleComputeBillItemsCost(tenantId: number, bill) {
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