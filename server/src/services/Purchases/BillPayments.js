import express from 'express';
import { omit } from 'lodash';
import { check, query, validationResult, param } from 'express-validator';
import { BillPayment, BillPaymentEntry, Vendor } from '@/models';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import ServiceItemsEntries from '../Sales/ServiceItemsEntries';
import AccountsService from '../Accounts/AccountsService';
import JournalPoster from '../Accounting/JournalPoster';
import JournalEntry from '../Accounting/JournalEntry';

export default class BillPaymentsService {
  /**
   * Creates a new bill payment transcations and store it to the storage
   * with associated bills entries and journal transactions.
   *
   * Precedures
   * ------
   * - Records the bill payment transaction.
   * - Records the bill payment associated entries.
   * - Increment the payment amount of the given vendor bills.
   * - Decrement the vendor balance.
   * - Records payment journal entries.
   *
   * @param {IBillPayment} billPayment
   */
  static async createBillPayment(billPayment) {
    const amount = sumBy(billPayment.entries, 'paymentAmount');
    const storedBillPayment = await BillPayment.tenant()
      .query()
      .insert({
        amount,
        ...omit(billPayment, ['entries']),
      });
    const storeOpers = [];

    billPayment.entries.forEach((entry) => {
      const oper = BillPaymentEntry.tenant()
        .query()
        .insert({
          bill_payment_id: storedBillPayment.id,
          ...entry,
        });
      // Increment the bill payment amount.
      const billOper = BillPayment.changePaymentAmount(
        entry.billId,
        entry.paymentAmount
      );
      storeOpers.push(billOper);
      storeOpers.push(oper);
    });
    // Decrement the vendor balance after bills payments.
    const vendorDecrementOper = Vendor.changeBalanace(
      billPayment.vendor_id,
      amount * -1
    );
    // Records the journal transactions after bills payment
    // and change diff acoount balance.
    const recordJournalTransaction = this.recordPaymentReceiveJournalEntries({
      id: storedBillPayment.id,
      ...billPayment,
    });
    await Promise.all([
      ...storeOpers,
      recordJournalTransaction,
      vendorDecrementOper,
    ]);
    return storedBillPayment;
  }

  /**
   * Edits the details of the given bill payment.
   *
   * Preceducres.
   * -------
   * - Update the bill payment transaction.
   * - Insert the new bill payment entries that have no ids.
   * - Update the bill paymeny entries that have ids.
   * - Delete the bill payment entries that not presented.
   * - Re-insert the journal transactions and update the diff accounts balance.
   * - Update the diff vendor balance.
   * - Update the diff bill payment amount.
   *
   * @param {Integer} billPaymentId
   * @param {IBillPayment} billPayment
   * @param {IBillPayment} oldBillPayment
   */
  static async editBillPayment(billPaymentId, billPayment, oldBillPayment) {
    const amount = sumBy(bilPayment.entries, 'payment_amount');
    const updateBillPayment = await BillPayment.tenant()
      .query()
      .where('id', billPaymentId)
      .update({
        amount,
        ...omit(billPayment, ['entries']),
      });
    const opers = [];
    const entriesHasIds = billpayment.entries.filter((i) => i.id);
    const entriesHasNoIds = billPayment.entries.filter((e) => !e.id);

    const entriesIds = entriesHasIds.map((e) => e.id);

    const entriesIdsShouldDelete = ServiceItemsEntries.entriesShouldDeleted(
      oldBillPayment.entries,
      entriesHasIds
    );
    if (entriesIdsShouldDelete.length > 0) {
      const deleteOper = BillPaymentEntry.tenant()
        .query()
        .bulkDelete(entriesIdsShouldDelete);
      opers.push(deleteOper);
    }
    // Entries that should be update to the storage.
    if (entriesHasIds.length > 0) {
      const updateOper = BillPaymentEntry.tenant()
        .query()
        .bulkUpdate(entriesHasIds, { where: 'id' });
      opers.push(updateOper);
    }
    // Entries that should be inserted to the storage.
    if (entriesHasNoIds.length > 0) {
      const insertOper = BillPaymentEntry.tenant()
        .query()
        .bulkInsert(
          entriesHasNoIds.map((e) => ({ ...e, bill_payment_id: billPaymentId }))
        );
      opers.push(insertOper);
    }
    // Records the journal transactions after bills payment and change
    // different acoount balance.
    const recordJournalTransaction = this.recordPaymentReceiveJournalEntries({
      id: storedBillPayment.id,
      ...billPayment,
    });
    // Change the different vendor balance between the new and old one.
    const changeDiffBalance = Vendor.changeDiffBalance(
      billPayment.vendor_id,
      oldBillPayment.vendor_id,
      billPayment.amount,
      oldBillPayment.amount
    );
    await Promise.all([
      ...opers,
      recordJournalTransaction,
      changeDiffBalance,
    ]);
  }

  /**
   * Deletes the bill payment and associated transactions.
   * @param {Integer} billPaymentId - 
   * @return {Promise}
   */
  static async deleteBillPayment(billPaymentId) {
    const billPayment = await BillPayment.tenant().query().where('id', billPaymentId).first();

    await BillPayment.tenant().query().where('id', billPaymentId).delete();
    await BillPaymentEntry.tenant()
      .query()
      .where('bill_payment_id', billPaymentId)
      .delete();

    const deleteTransactionsOper = this.deleteJournalTransactions(
      billPaymentId,
      'BillPayment'
    );
    const revertVendorBalance = Vendor.changeBalanace(
      billpayment.vendor_id,
      billPayment.amount * -1,
    );
    return Promise.all([
      deleteTransactionsOper,
      revertVendorBalance,
    ]);
  }

  /**
   * Records bill payment receive journal transactions.
   * @param {BillPayment} billPayment
   * @param {Integer} billPaymentId
   */
  static async recordPaymentReceiveJournalEntries(billPayment) {
    const paymentAmount = sumBy(billPayment.entries, 'payment_amount');
    const formattedDate = moment(billPayment.payment_date).format('YYYY-MM-DD');
    const payableAccount = await AccountsService.getAccountByType(
      'accounts_payable'
    );

    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);

    const commonJournal = {
      debit: 0,
      credit: 0,
      referenceId: billPayment.id,
      referenceType: 'BillPayment',
      date: formattedDate,
    };
    if (billPayment.id) {
      const transactions = await AccountTransaction.tenant()
        .query()
        .whereIn('reference_type', ['BillPayment'])
        .where('reference_id', billPayment.id)
        .withGraphFetched('account.type');

      journal.loadEntries(transactions);
      journal.removeEntries();
    }
    const debitReceivable = new JournalEntry({
      ...commonJournal,
      debit: paymentAmount,
      contactType: 'Vendor',
      contactId: billpayment.vendor_id,
      account: payableAccount.id,
    });
    const creditPaymentAccount = new JournalEntry({
      ...commonJournal,
      credit: paymentAmount,
      account: billPayment.payment_account_id,
    });
    journal.debit(debitReceivable);
    journal.credit(creditPaymentAccount);

    await Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }

  static async getBillPayment(billPaymentId) {
    
  }

  /**
   * Detarmines whether the bill payment exists on the storage.
   * @param {Integer} billPaymentId 
   */
  static async isBillPaymentExists(billPaymentId) {
    const billPayment = await BillPayment.tenant().query()
      .where('id', billPaymentId)
      .first();
    return billPayment.length > 0;
  }
}
