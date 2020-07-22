import { omit } from 'lodash';
import { Bill, BillPayment } from '@/models';
import { Item } from '@/models';
import { Account } from '../../models';
import JournalPoster from '../Accounting/JournalPoster';

export default class BillsService {
  /**
   * Creates a new bill and stored it to the storage.
   * @param {IBill} bill -
   * @return {void}
   */
  static async createBill(bill) {
    const storedBill = await Bill.tenant().query().insert({
      ...omit(bill, ['entries']),
    });
  }

  /**
   * Edits details of the given bill id with associated entries.
   * @param {Integer} billId 
   * @param {IBill} bill 
   */
  static async editBill(billId, bill) {
    const updatedBill = await Bill.tenant().query().insert({
      ...omit(bill, ['entries']),
    });
  }

  /**
   * Records the bill journal transactions.
   * @param {IBill} bill 
   */
  async recordJournalTransactions(bill) {
    const entriesItemsIds = bill.entries.map(entry => entry.item_id);
    const payableTotal = sumBy(bill, 'entries.total');
    const storedItems = await Item.tenant().query().whereIn('id', entriesItemsIds);

    const payableAccount = await Account.tenant().query();
    const formattedDate = moment(saleInvoice.invoice_date).format('YYYY-MM-DD');

    const accountsDepGraph = await Account.depGraph().query().remember();
    const journal = new JournalPoster(accountsDepGraph);

    const commonJournalMeta = {
      debit: 0,
      credit: 0,
      referenceId: bill.id,
      referenceType: 'Bill',
      date: formattedDate,
      accural: true,
    };
    const payableEntry = await JournalEntry({
      ...commonJournalMeta,
      credit: payableTotal,
      contactId: bill.vendorId,
      contactType: 'Vendor',
    });
    journal.credit(payableEntry);

    bill.entries.forEach((item) => {
      if (['inventory'].indexOf(item.type) !== -1) {
        const inventoryEntry = new JournalEntry({
          ...commonJournalMeta,
          account: item.inventoryAccountId,
        });
        journal.debit(inventoryEntry);
      } else {
        const costEntry = new JournalEntry({
          ...commonJournalMeta,
          account: item.costAccountId,
        });
        journal.debit(costEntry);
      }
    });
    await Promise.all([
      journal.saveEntries(),
      journal.saveBalance(),
    ])
  }

  /**
   * Deletes the bill with associated entries.
   * @param {Integer} billId 
   * @return {void}
   */
  static async deleteBill(billId) {
    await BillPayment.tenant().query().where('id', billId);
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
  isBillsExist(billsIds) {

  }

  static async isBillNoExists(billNumber) {
    const foundBills = await Bill.tenant().query().where('bill_number', billNumber);
    return foundBills.length > 0;
  }
}