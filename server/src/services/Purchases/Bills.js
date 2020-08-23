import { omit, sumBy, pick } from 'lodash';
import moment from 'moment';
import {
  Account,
  Bill,
  Vendor,
  ItemEntry,
  Item,
  AccountTransaction,
} from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import AccountsService from '@/services/Accounts/AccountsService';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import InventoryService from '@/services/Inventory/Inventory';
import HasItemsEntries from '@/services/Sales/HasItemsEntries';
import SalesInvoicesCost from '@/services/Sales/SalesInvoicesCost';
import { formatDateFields } from '@/utils';

/**
 * Vendor bills services.
 * @service
 */
export default class BillsService extends SalesInvoicesCost {
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
   * @param {IBill} bill -
   * @return {void}
   */
  static async createBill(billDTO) {
    const invLotNumber = await InventoryService.nextLotNumber();
    const bill = {
      ...formatDateFields(billDTO, ['bill_date', 'due_date']),
      amount: sumBy(billDTO.entries, 'amount'),
      invLotNumber: billDTO.invLotNumber || invLotNumber
    };
    const saveEntriesOpers = [];

    const storedBill = await Bill.tenant()
      .query()
      .insert({
        ...omit(bill, ['entries']),
      });
    bill.entries.forEach((entry) => {
      const oper = ItemEntry.tenant()
        .query()
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
      bill, storedBill.id
    );
    // Writes the journal entries for the given bill transaction.
    const writeJEntriesOper = this.recordJournalTransactions({
      id: storedBill.id, ...bill,
    });
    await Promise.all([
      incrementOper,
      writeInvTransactionsOper,
      writeJEntriesOper,
    ]);
    // Schedule bill re-compute based on the item cost
    // method and starting date.
    await this.scheduleComputeBillItemsCost(bill); 

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
   * @param {Integer} billId - The given bill id.
   * @param {IBill} bill - The given new bill details.
   */
  static async editBill(billId, billDTO) {
    const oldBill = await Bill.tenant().query().findById(billId);
    const bill = {
      ...formatDateFields(billDTO, ['bill_date', 'due_date']),
      amount: sumBy(billDTO.entries, 'amount'),
      invLotNumber: oldBill.invLotNumber,
    };
    // Update the bill transaction.
    const updatedBill = await Bill.tenant()
      .query()
      .where('id', billId)
      .update({
        ...omit(bill, ['entries', 'invLotNumber'])
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
    // Changes the diff vendor balance between old and new amount.
    const changeVendorBalanceOper = Vendor.changeDiffBalance(
      bill.vendor_id,
      oldBill.vendorId,
      bill.amount,
      oldBill.amount,
    );
    // Re-write the inventory transactions for inventory items.
    const writeInvTransactionsOper = this.recordInventoryTransactions(bill, billId, true);

    // Writes the journal entries for the given bill transaction.
    const writeJEntriesOper = this.recordJournalTransactions({
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
    await this.scheduleComputeBillItemsCost(bill); 
  }

  /**
   * Deletes the bill with associated entries.
   * @param {Integer} billId
   * @return {void}
   */
  static async deleteBill(billId) {
    const bill = await Bill.tenant().query()
      .where('id', billId)
      .withGraphFetched('entries')
      .first();

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
    const deleteInventoryTransOper = InventoryService.deleteInventoryTransactions(
      billId, 'Bill'
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
    await this.scheduleComputeBillItemsCost(bill); 
  }

  /**
   * Records the inventory transactions from the given bill input.
   * @param {Bill} bill 
   * @param {number} billId 
   */
  static recordInventoryTransactions(bill, billId, override) {
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

    return InventoryService.recordInventoryTransactions(
      inventoryTransactions, override
    );
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
    const payableAccount = await AccountsService.getAccountByType('accounts_payable');

    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);

    const commonJournalMeta = {
      debit: 0,
      credit: 0,
      referenceId: bill.id,
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
    return Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
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

  /**
   * Schedules compute bill items cost based on each item cost method.
   * @param {IBill} bill 
   * @return {Promise}
   */
  static scheduleComputeBillItemsCost(bill) {
    return this.scheduleComputeItemsCost(
      bill.entries.map((e) => e.item_id),
      bill.bill_date,
    );
  }
}
