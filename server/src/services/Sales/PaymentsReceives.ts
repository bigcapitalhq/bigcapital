import { omit, sumBy, chain } from 'lodash';
import moment from 'moment';
import {
  AccountTransaction,
  PaymentReceive,
  PaymentReceiveEntry,
  SaleInvoice,
  Customer,
  Account,
} from '@/models';
import AccountsService from '@/services/Accounts/AccountsService';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import ServiceItemsEntries from '@/services/Sales/ServiceItemsEntries';
import PaymentReceiveEntryRepository from '@/repositories/PaymentReceiveEntryRepository';
import CustomerRepository from '@/repositories/CustomerRepository';
import { formatDateFields } from '@/utils';

/**
 * Payment receive service.
 * @service
 */
export default class PaymentReceiveService {
  /**
   * Creates a new payment receive and store it to the storage
   * with associated invoices payment and journal transactions.
   * @async
   * @param {IPaymentReceive} paymentReceive
   */
  static async createPaymentReceive(paymentReceive: any) {
    const paymentAmount = sumBy(paymentReceive.entries, 'payment_amount');
    const storedPaymentReceive = await PaymentReceive.tenant()
      .query()
      .insert({
        amount: paymentAmount,
        ...formatDateFields(omit(paymentReceive, ['entries']), ['payment_date']),
      });
    const storeOpers: Array<any> = [];

    paymentReceive.entries.forEach((entry: any) => {
      const oper = PaymentReceiveEntry.tenant()
        .query()
        .insert({
          payment_receive_id: storedPaymentReceive.id,
          ...entry,
        });
      // Increment the invoice payment amount.
      const invoice = SaleInvoice.tenant()
        .query()
        .where('id', entry.invoice_id)
        .increment('payment_amount', entry.payment_amount);

      storeOpers.push(oper);
      storeOpers.push(invoice);
    });
    const customerIncrementOper = Customer.decrementBalance(
      paymentReceive.customer_id,
      paymentAmount,
    );
    // Records the sale invoice journal transactions.
    const recordJournalTransactions = this.recordPaymentReceiveJournalEntries({
        id: storedPaymentReceive.id,
        ...paymentReceive,
      });
    await Promise.all([
      ...storeOpers,
      customerIncrementOper,
      recordJournalTransactions,
    ]);
    return storedPaymentReceive;
  }

  /**
   * Edit details the given payment receive with associated entries.
   * ------
   * - Update the payment receive transactions.
   * - Insert the new payment receive entries.
   * - Update the given payment receive entries.
   * - Delete the not presented payment receive entries.
   * - Re-insert the journal transactions and update the different accounts balance.
   * - Update the different customer balances.
   * - Update the different invoice payment amount.
   * @async
   * @param {Integer} paymentReceiveId
   * @param {IPaymentReceive} paymentReceive
   * @param {IPaymentReceive} oldPaymentReceive
   */
  static async editPaymentReceive(
    paymentReceiveId: number,
    paymentReceive: any,
    oldPaymentReceive: any
  ) {
    const paymentAmount = sumBy(paymentReceive.entries, 'payment_amount');
    // Update the payment receive transaction.
    const updatePaymentReceive = await PaymentReceive.tenant()
      .query()
      .where('id', paymentReceiveId)
      .update({
        amount: paymentAmount,
        ...formatDateFields(omit(paymentReceive, ['entries']), ['payment_date']),
      });
    const opers = [];
    const entriesIds = paymentReceive.entries.filter((i: any) => i.id);
    const entriesShouldInsert = paymentReceive.entries.filter((i: any) => !i.id);

    // Detarmines which entries ids should be deleted.
    const entriesIdsShouldDelete = ServiceItemsEntries.entriesShouldDeleted(
      oldPaymentReceive.entries,
      entriesIds
    );
    if (entriesIdsShouldDelete.length > 0) {
      // Deletes the given payment receive entries.
      const deleteOper = PaymentReceiveEntryRepository.deleteBulk(
        entriesIdsShouldDelete
      );
      opers.push(deleteOper);
    }
    // Entries that should be updated to the storage.
    if (entriesIds.length > 0) {
      const updateOper = PaymentReceiveEntryRepository.updateBulk(entriesIds);
      opers.push(updateOper);
    }
    // Entries should insert to the storage.
    if (entriesShouldInsert.length > 0) {
      const insertOper = PaymentReceiveEntryRepository.insertBulk(
        entriesShouldInsert,
        paymentReceiveId
      );
      opers.push(insertOper);
    }
    // Re-write the journal transactions of the given payment receive.
    const recordJournalTransactions = this.recordPaymentReceiveJournalEntries(
      {
        id: oldPaymentReceive.id,
        ...paymentReceive,
      },
      paymentReceiveId,
    );
    // Increment/decrement the customer balance after calc the diff
    // between old and new value.
    const changeCustomerBalance = CustomerRepository.changeDiffBalance(
      paymentReceive.customer_id,
      oldPaymentReceive.customerId,
      paymentAmount * -1,
      oldPaymentReceive.amount * -1,
    );
    // Change the difference between the old and new invoice payment amount.
    const diffInvoicePaymentAmount = this.saveChangeInvoicePaymentAmount(
      oldPaymentReceive.entries,
      paymentReceive.entries
    );
    // Await the async operations.
    await Promise.all([
      ...opers,
      recordJournalTransactions,
      changeCustomerBalance,
      diffInvoicePaymentAmount,
    ]);
  }

  /**
   * Deletes the given payment receive with associated entries
   * and journal transactions.
   * -----
   * - Deletes the payment receive transaction.
   * - Deletes the payment receive associated entries.
   * - Deletes the payment receive associated journal transactions.
   * - Revert the customer balance.
   * - Revert the payment amount of the associated invoices.
   * @async
   * @param {Integer} paymentReceiveId
   * @param {IPaymentReceive} paymentReceive
   */
  static async deletePaymentReceive(paymentReceiveId: number, paymentReceive: any) {
    // Deletes the payment receive transaction.
    await PaymentReceive.tenant()
      .query()
      .where('id', paymentReceiveId)
      .delete();

    // Deletes the payment receive associated entries.
    await PaymentReceiveEntry.tenant()
      .query()
      .where('payment_receive_id', paymentReceiveId)
      .delete();

    // Delete all associated journal transactions to payment receive transaction.
    const deleteTransactionsOper = JournalPosterService.deleteJournalTransactions(
      paymentReceiveId,
      'PaymentReceive'
    );
    // Revert the customer balance.
    const revertCustomerBalance = Customer.incrementBalance(
      paymentReceive.customerId,
      paymentReceive.amount
    );
    // Revert the invoices payments amount.
    const revertInvoicesPaymentAmount = this.revertInvoicePaymentAmount(
      paymentReceive.entries.map((entry: any) => ({
        invoiceId: entry.invoiceId,
        revertAmount: entry.paymentAmount,
      }))
    );
    await Promise.all([
      deleteTransactionsOper,
      revertCustomerBalance,
      revertInvoicesPaymentAmount,
    ]);
  }

  /**
   * Retrieve the payment receive details of the given id.
   * @param {Integer} paymentReceiveId
   */
  static async getPaymentReceive(paymentReceiveId: number) {
    const paymentReceive = await PaymentReceive.tenant()
      .query()
      .where('id', paymentReceiveId)
      .withGraphFetched('entries.invoice')
      .first();
    return paymentReceive;
  }

  /**
   * Retrieve the payment receive details with associated invoices.
   * @param {Integer} paymentReceiveId
   */
  static async getPaymentReceiveWithInvoices(paymentReceiveId: number) {
    return PaymentReceive.tenant()
      .query()
      .where('id', paymentReceiveId)
      .withGraphFetched('invoices')
      .first();
  }

  /**
   * Detarmines whether the payment receive exists on the storage.
   * @param {Integer} paymentReceiveId
   */
  static async isPaymentReceiveExists(paymentReceiveId: number) {
    const paymentReceives = await PaymentReceive.tenant()
      .query()
      .where('id', paymentReceiveId);
    return paymentReceives.length > 0;
  }

  /**
   * Detarmines the payment receive number existance.
   * @async
   * @param {Integer} paymentReceiveNumber - Payment receive number.
   * @param {Integer} paymentReceiveId - Payment receive id.
   */
  static async isPaymentReceiveNoExists(
    paymentReceiveNumber: string|number,
    paymentReceiveId: number
  ) {
    const paymentReceives = await PaymentReceive.tenant()
      .query()
      .where('payment_receive_no', paymentReceiveNumber)
      .onBuild((query) => {
        if (paymentReceiveId) {
          query.whereNot('id', paymentReceiveId);
        }
      });
    return paymentReceives.length > 0;
  }

  /**
   * Records payment receive journal transactions.
   * 
   * Invoice payment journals.
   * --------
   * - Account receivable -> Debit
   * - Payment account [current asset] -> Credit
   * 
   * @async
   * @param {IPaymentReceive} paymentReceive
   * @param {Number} paymentReceiveId
   */
  static async recordPaymentReceiveJournalEntries(
    paymentReceive: any,
    paymentReceiveId?: number
  ) {
    const paymentAmount = sumBy(paymentReceive.entries, 'payment_amount');
    const formattedDate = moment(paymentReceive.payment_date).format('YYYY-MM-DD');
    const receivableAccount = await AccountsService.getAccountByType(
      'accounts_receivable'
    );
    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);
    const commonJournal = {
      debit: 0,
      credit: 0,
      referenceId: paymentReceive.id,
      referenceType: 'PaymentReceive',
      date: formattedDate,
    };
    if (paymentReceiveId) {
      const transactions = await AccountTransaction.tenant()
        .query()
        .whereIn('reference_type', ['PaymentReceive'])
        .where('reference_id', paymentReceiveId)
        .withGraphFetched('account.type');

      journal.loadEntries(transactions);
      journal.removeEntries();
    }
    const creditReceivable = new JournalEntry({
      ...commonJournal,
      credit: paymentAmount,
      contactType: 'Customer',
      contactId: paymentReceive.customer_id,
      account: receivableAccount.id,
    });
    const debitDepositAccount = new JournalEntry({
      ...commonJournal,
      debit: paymentAmount,
      account: paymentReceive.deposit_account_id,
    });
    journal.credit(creditReceivable);
    journal.debit(debitDepositAccount);

    await Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }

  /**
   * Revert the payment amount of the given invoices ids.
   * @param {Array} revertInvoices
   */
  static async revertInvoicePaymentAmount(revertInvoices: any[]) {
    const opers: Promise<T>[] = [];

    revertInvoices.forEach((revertInvoice) => {
      const { revertAmount, invoiceId } = revertInvoice;
      const oper = SaleInvoice.tenant()
        .query()
        .where('id', invoiceId)
        .decrement('payment_amount', revertAmount);
      opers.push(oper);
    });
    await Promise.all(opers);
  }

  /**
   * Saves difference changing between old and new invoice payment amount.
   * @param {Array} paymentReceiveEntries
   * @param {Array} newPaymentReceiveEntries
   * @return 
   */
  static async saveChangeInvoicePaymentAmount(
    paymentReceiveEntries: [],
    newPaymentReceiveEntries: [],
  ) {
    const opers: Promise<T>[] = [];
    const newEntriesTable = chain(newPaymentReceiveEntries)
      .groupBy('invoice_id')
      .mapValues((group) => (sumBy(group, 'payment_amount') || 0) * -1)
      .value();

    const diffEntries = chain(paymentReceiveEntries)
      .groupBy('invoiceId')
      .mapValues((group) => (sumBy(group, 'paymentAmount') || 0) * -1)
      .mapValues((value, key) => value - (newEntriesTable[key] || 0))
      .mapValues((value, key) => ({ invoice_id: key, payment_amount: value }))
      .filter((entry) => entry.payment_amount != 0)
      .values()
      .value();

    diffEntries.forEach((diffEntry: any) => {
      const oper = SaleInvoice.changePaymentAmount(
        diffEntry.invoice_id,
        diffEntry.payment_amount
      );
      opers.push(oper);
    });
    return Promise.all([ ...opers ]);
  }
}
