import { Inject, Service } from 'typedi';
import { omit, sumBy } from 'lodash';
import moment from 'moment';
import { IBillPaymentOTD, IBillPayment } from '@/interfaces';
import ServiceItemsEntries from '@/services/Sales/ServiceItemsEntries';
import AccountsService from '@/services/Accounts/AccountsService';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import TenancyService from '@/services/Tenancy/TenancyService';
import { formatDateFields } from '@/utils';

/**
 * Bill payments service.
 * @service
 */
@Service()
export default class BillPaymentsService {
  @Inject()
  accountsService: AccountsService;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  journalService: JournalPosterService;

  /**
   * Creates a new bill payment transcations and store it to the storage
   * with associated bills entries and journal transactions.
   *
   * Precedures:-
   * ------
   * - Records the bill payment transaction.
   * - Records the bill payment associated entries.
   * - Increment the payment amount of the given vendor bills.
   * - Decrement the vendor balance.
   * - Records payment journal entries.
   * @param {number} tenantId - Tenant id.
   * @param {BillPaymentDTO} billPayment - Bill payment object.
   */
  async createBillPayment(tenantId: number, billPaymentDTO: IBillPaymentOTD) {
    const { Bill, BillPayment, BillPaymentEntry, Vendor } = this.tenancy.models(tenantId);

    const billPayment = {
      amount: sumBy(billPaymentDTO.entries, 'payment_amount'),
      ...formatDateFields(billPaymentDTO, ['payment_date']),
    }
    const storedBillPayment = await BillPayment.query()
      .insert({
        ...omit(billPayment, ['entries']),
      });
    const storeOpers: Promise<any>[] = [];

    billPayment.entries.forEach((entry) => {
      const oper = BillPaymentEntry.query()
        .insert({
          bill_payment_id: storedBillPayment.id,
          ...entry,
        });
      // Increment the bill payment amount.
      const billOper = Bill.changePaymentAmount(
        entry.bill_id,
        entry.payment_amount,
      );
      storeOpers.push(billOper);
      storeOpers.push(oper);
    });
    // Decrement the vendor balance after bills payments.
    const vendorDecrementOper = Vendor.changeBalance(
      billPayment.vendor_id,
      billPayment.amount * -1,
    );
    // Records the journal transactions after bills payment
    // and change diff acoount balance.
    const recordJournalTransaction = this.recordPaymentReceiveJournalEntries(tenantId, {
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
   * Preceducres:
   * ------
   * - Update the bill payment transaction.
   * - Insert the new bill payment entries that have no ids.
   * - Update the bill paymeny entries that have ids.
   * - Delete the bill payment entries that not presented.
   * - Re-insert the journal transactions and update the diff accounts balance.
   * - Update the diff vendor balance.
   * - Update the diff bill payment amount.
   * @param {number} tenantId - Tenant id
   * @param {Integer} billPaymentId
   * @param {BillPaymentDTO} billPayment
   * @param {IBillPayment} oldBillPayment
   */
  async editBillPayment(
    tenantId: number,
    billPaymentId: number,
    billPaymentDTO,
    oldBillPayment,
  ) {
    const { BillPayment, BillPaymentEntry, Vendor } = this.tenancy.models(tenantId);
    const billPayment = {
      amount: sumBy(billPaymentDTO.entries, 'payment_amount'),
      ...formatDateFields(billPaymentDTO, ['payment_date']),
    };
    const updateBillPayment = await BillPayment.query()
      .where('id', billPaymentId)
      .update({
        ...omit(billPayment, ['entries']),
      });
    const opers = [];
    const entriesHasIds = billPayment.entries.filter((i) => i.id);
    const entriesHasNoIds = billPayment.entries.filter((e) => !e.id);

    const entriesIdsShouldDelete = ServiceItemsEntries.entriesShouldDeleted(
      oldBillPayment.entries,
      entriesHasIds
    );
    if (entriesIdsShouldDelete.length > 0) {
      const deleteOper = BillPaymentEntry.query()
        .bulkDelete(entriesIdsShouldDelete);
      opers.push(deleteOper);
    }
    // Entries that should be update to the storage.
    if (entriesHasIds.length > 0) {
      const updateOper = BillPaymentEntry.query()
        .bulkUpdate(entriesHasIds, { where: 'id' });
      opers.push(updateOper);
    }
    // Entries that should be inserted to the storage.
    if (entriesHasNoIds.length > 0) {
      const insertOper = BillPaymentEntry.query()
        .bulkInsert(
          entriesHasNoIds.map((e) => ({ ...e, bill_payment_id: billPaymentId }))
        );
      opers.push(insertOper);
    }
    // Records the journal transactions after bills payment and change
    // different acoount balance.
    const recordJournalTransaction = this.recordPaymentReceiveJournalEntries(tenantId, {
      id: storedBillPayment.id,
      ...billPayment,
    });
    // Change the different vendor balance between the new and old one.
    const changeDiffBalance = Vendor.changeDiffBalance(
      billPayment.vendor_id,
      oldBillPayment.vendorId,
      billPayment.amount * -1,
      oldBillPayment.amount * -1,
    );
    await Promise.all([
      ...opers,
      recordJournalTransaction,
      changeDiffBalance,
    ]);
  }

  /**
   * Deletes the bill payment and associated transactions.
   * @param {number} tenantId - Tenant id.
   * @param {Integer} billPaymentId - The given bill payment id.
   * @return {Promise}
   */
  async deleteBillPayment(tenantId: number, billPaymentId: number) {
    const { BillPayment, BillPaymentEntry, Vendor } = this.tenancy.models(tenantId);
    const billPayment = await BillPayment.query().where('id', billPaymentId).first();

    await BillPayment.query()
      .where('id', billPaymentId)
      .delete();

    await BillPaymentEntry.query()
      .where('bill_payment_id', billPaymentId)
      .delete();

    const deleteTransactionsOper = JournalPosterService.deleteJournalTransactions(
      billPaymentId,
      'BillPayment',
    );
    const revertVendorBalanceOper = Vendor.changeBalance(
      billPayment.vendorId,
      billPayment.amount,
    );
    return Promise.all([
      deleteTransactionsOper,
      revertVendorBalanceOper,
    ]);
  }

  /**
   * Records bill payment receive journal transactions.
   * @param {number} tenantId - 
   * @param {BillPayment} billPayment
   * @param {Integer} billPaymentId
   */
  async recordPaymentReceiveJournalEntries(tenantId: number, billPayment) {
    const { AccountTransaction, Account } = this.tenancy.models(tenantId);

    const paymentAmount = sumBy(billPayment.entries, 'payment_amount');
    const formattedDate = moment(billPayment.payment_date).format('YYYY-MM-DD');
    const payableAccount = await this.accountsService.getAccountByType(
      tenantId,
      'accounts_payable'
    );

    const accountsDepGraph = await Account.depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);

    const commonJournal = {
      debit: 0,
      credit: 0,
      referenceId: billPayment.id,
      referenceType: 'BillPayment',
      date: formattedDate,
    };
    if (billPayment.id) {
      const transactions = await AccountTransaction.query()
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
      contactId: billPayment.vendor_id,
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

  /**
   * Retrieve bill payment with associated metadata.
   * @param {number} billPaymentId - The bill payment id.
   * @return {object}
   */
  async getBillPaymentWithMetadata(tenantId: number, billPaymentId: number) {
    const { BillPayment } = this.tenancy.models(tenantId);
    const billPayment = await BillPayment.query()
      .where('id', billPaymentId)
      .withGraphFetched('entries')
      .withGraphFetched('vendor')
      .withGraphFetched('paymentAccount')
      .first();

    return billPayment;
  }

  /**
   * Detarmines whether the bill payment exists on the storage.
   * @param {Integer} billPaymentId 
   * @return {boolean}
   */
  async isBillPaymentExists(tenantId: number, billPaymentId: number) {
    const { BillPayment } = this.tenancy.models(tenantId);
    const billPayment = await BillPayment.query()
      .where('id', billPaymentId)
      .first();

    return (billPayment.length > 0);
  }
}
