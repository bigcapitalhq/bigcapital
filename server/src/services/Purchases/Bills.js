import { omit, sumBy } from 'lodash';
import moment from 'moment';
import {
  Account,
  Bill,
  Vendor,
  ItemEntry,
  Item,
  InventoryTransaction,
  AccountTransaction,
} from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import AccountsService from '@/services/Accounts/AccountsService';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import InventoryService from '@/services/Inventory/Inventory';
import HasItemsEntries from '@/services/Sales/HasItemsEntries';

/**
 * Vendor bills services.
 */
export default class BillsService {
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
   *
   * @param {IBill} bill -
   * @return {void}
   */
  static async createBill(bill) {
    const amount = sumBy(bill.entries, 'amount');
    const saveEntriesOpers = [];

    const storedBill = await Bill.tenant()
      .query()
      .insert({
        amount,
        ...omit(bill, ['entries']),
      });
    bill.entries.forEach((entry) => {
      const oper = ItemEntry.tenant()
        .query()
        .insert({
          reference_type: 'Bill',
          reference_id: storedBill.id,
          ...omit(entry, ['amount']),
        });
      saveEntriesOpers.push(oper);
    });
    // Increment vendor balance.
    const incrementOper = Vendor.changeBalance(bill.vendor_id, amount);
  
    await Promise.all([
      ...saveEntriesOpers,
      incrementOper,
      this.recordInventoryTransactions(bill, storedBill.id),
      this.recordJournalTransactions({ ...bill, id: storedBill.id }),
    ]);
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
   * @param {Integer} billId
   * @param {IBill} bill
   */
  static async editBill(billId, bill) {
    const amount = sumBy(bill.entries, 'amount');

    // Update the bill transaction.
    const updatedBill = await Bill.tenant()
      .query()
      .where('id', billId)
      .update({
        amount,
        ...omit(bill, ['entries'])
      });

    // Old stored entries.
    const storedEntries = await ItemEntry.tenant()
      .query()
      .where('reference_id', billId)
      .where('reference_type', 'Bill');

    // Patch the bill entries.
    const patchEntriesOper = HasItemsEntries.patchItemsEntries(
      bill.entries, storedEntries, 'Bill', billId,
    );
    // Record bill journal transactions.
    const recordTransactionsOper = this.recordJournalTransactions(bill, billId);

    await Promise.all([
      patchEntriesOper,
      recordTransactionsOper,
    ]);
  }

  /**
   * Records inventory transactions.
   * @param  {IBill} bill -
   * @return {void}
   */
  static async recordInventoryTransactions(bill, billId) {
    const storeInventoryTransactions = [];
    const entriesItemsIds = bill.entries.map((e) => e.item_id);
    const inventoryItems = await Item.tenant()
      .query()
      .whereIn('id', entriesItemsIds)
      .where('type', 'inventory');

    const inventoryItemsIds = inventoryItems.map((i) => i.id);
    const inventoryEntries = bill.entries.filter(
      (entry) => inventoryItemsIds.indexOf(entry.item_id) !== -1
    );
    inventoryEntries.forEach((entry) => {
      const oper = InventoryTransaction.tenant().query().insert({
        direction: 'IN',
        date: bill.bill_date,

        item_id: entry.item_id,
        quantity: entry.quantity,
        rate: entry.rate,
        remaining: entry.quantity,

        transaction_type: 'Bill',
        transaction_id: billId,
      });
      storeInventoryTransactions.push(oper);
    });
    return Promise.all([...storeInventoryTransactions]);
  }

  /**
   * Records the bill journal transactions.
   * @async
   * @param {IBill} bill
   * @param {Integer} billId
   */
  static async recordJournalTransactions(bill, billId) {
    const entriesItemsIds = bill.entries.map((entry) => entry.item_id);
    const payableTotal = sumBy(bill.entries, 'amount');
    const formattedDate = moment(bill.bill_date).format('YYYY-MM-DD');

    const storedItems = await Item.tenant()
      .query()
      .whereIn('id', entriesItemsIds);

    const storedItemsMap = new Map(storedItems.map((item) => [item.id, item]));
    const payableAccount = await AccountsService.getAccountByType(
      'accounts_payable'
    );
    if (!payableAccount) {
      throw new Error('New payable account on the storage.');
    }
    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);

    const commonJournalMeta = {
      debit: 0,
      credit: 0,
      referenceId: billId,
      referenceType: 'Bill',
      date: formattedDate,
      accural: true,
    };
    if (billId) {
      const transactions = await AccountTransaction.tenant()
        .query()
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
      const item = storedItemsMap.get(entry.item_id);

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
    await Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }

  /**
   * Deletes the bill with associated entries.
   * @param {Integer} billId
   * @return {void}
   */
  static async deleteBill(billId) {
    const bill = await Bill.tenant().query().where('id', billId).first();

    // Delete all associated bill entries.
    const deleteBillEntriesOper = ItemEntry.tenant()
      .query()
      .where('reference_type', 'Bill')
      .where('reference_id', billId)
      .delete();

    // Delete the bill transaction.
    const deleteBillOper = Bill.tenant().query().where('id', billId).delete();

    // Delete associated bill journal transactions.
    const deleteTransactionsOper = JournalPosterService.deleteJournalTransactions(
      billId,
      'Bill'
    );
    // Delete bill associated inventory transactions.
    const deleteInventoryTransOper = InventoryService.deleteTransactions(
      billId,
      'Bill'
    );
    // Revert vendor balance.
    const revertVendorBalance = Vendor.changeBalance(billId, bill.amount * -1);
  
    await Promise.all([
      deleteBillOper,
      deleteBillEntriesOper,
      deleteTransactionsOper,
      deleteInventoryTransOper,
      revertVendorBalance,
    ]);
  }

  /**
   * Detarmines whether the bill exists on the storage.
   * @param {Integer} billId
   * @return {Boolean}
   */
  static async isBillExists(billId) {
    const foundBills = await Bill.tenant().query().where('id', billId);
    return foundBills.length > 0;
  }

  /**
   * Detarmines whether the given bills exist on the storage in bulk.
   * @param {Array} billsIds
   * @return {Boolean}
   */
  static async isBillsExist(billsIds) {
    const bills = await Bill.tenant().query().whereIn('id', billsIds);
    return bills.length > 0;
  }

  /**
   * Detarmines whether the given bill id exists on the storage.
   * @param {Integer} billNumber 
   */
  static async isBillNoExists(billNumber) {
    const foundBills = await Bill.tenant()
      .query()
      .where('bill_number', billNumber);
    return foundBills.length > 0;
  }

  /**
   * Retrieve the given bill details with associated items entries.
   * @param {Integer} billId -
   * @returns {Promise}
   */
  static getBill(billId) {
    return Bill.tenant().query().where('id', billId).first();
  }


  /**
   * Retrieve the given bill details with associated items entries.
   * @param {Integer} billId -
   * @returns {Promise}
   */
  static getBillWithMetadata(billId) {
    return Bill.tenant()
      .query()
      .where('id', billId)
      .withGraphFetched('vendor')
      .withGraphFetched('entries')
      .first();
  }
}
