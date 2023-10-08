import moment from 'moment';
import { sumBy } from 'lodash';
import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import { AccountNormal, IBillPayment, ILedgerEntry } from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';

@Service()
export class BillPaymentGLEntries {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Creates a bill payment GL entries.
   * @param {number} tenantId
   * @param {number} billPaymentId
   * @param {Knex.Transaction} trx
   */
  public writePaymentGLEntries = async (
    tenantId: number,
    billPaymentId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const { BillPayment, Account } = this.tenancy.models(tenantId);

    // Retrieves the bill payment details with associated entries.
    const payment = await BillPayment.query(trx)
      .findById(billPaymentId)
      .withGraphFetched('entries.bill');

    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Finds or creates a new A/P account of the given currency.
    const APAccount = await accountRepository.findOrCreateAccountsPayable(
      payment.currencyCode,
      {},
      trx
    );
    // Exchange gain or loss account.
    const EXGainLossAccount = await Account.query(trx).modify(
      'findBySlug',
      'exchange-grain-loss'
    );
    // Retrieves the bill payment ledger.
    const ledger = this.getBillPaymentLedger(
      payment,
      APAccount.id,
      EXGainLossAccount.id,
      tenantMeta.baseCurrency
    );
    // Commits the ledger on the storage.
    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Rewrites the bill payment GL entries.
   * @param {number} tenantId
   * @param {number} billPaymentId
   * @param {Knex.Transaction} trx
   */
  public rewritePaymentGLEntries = async (
    tenantId: number,
    billPaymentId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    // Revert payment GL entries.
    await this.revertPaymentGLEntries(tenantId, billPaymentId, trx);

    // Write payment GL entries.
    await this.writePaymentGLEntries(tenantId, billPaymentId, trx);
  };

  /**
   * Reverts the bill payment GL entries.
   * @param {number} tenantId
   * @param {number} billPaymentId
   * @param {Knex.Transaction} trx
   */
  public revertPaymentGLEntries = async (
    tenantId: number,
    billPaymentId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    await this.ledgerStorage.deleteByReference(
      tenantId,
      billPaymentId,
      'BillPayment',
      trx
    );
  };

  /**
   * Retrieves the payment common entry.
   * @param {IBillPayment} billPayment
   * @returns {}
   */
  private getPaymentCommonEntry = (billPayment: IBillPayment) => {
    const formattedDate = moment(billPayment.paymentDate).format('YYYY-MM-DD');

    return {
      debit: 0,
      credit: 0,

      exchangeRate: billPayment.exchangeRate,
      currencyCode: billPayment.currencyCode,

      transactionId: billPayment.id,
      transactionType: 'BillPayment',

      transactionNumber: billPayment.paymentNumber,
      referenceNumber: billPayment.reference,

      date: formattedDate,
      createdAt: billPayment.createdAt,

      branchId: billPayment.branchId,
    };
  };

  /**
   * Calculates the payment total exchange gain/loss.
   * @param   {IBillPayment} paymentReceive - Payment receive with entries.
   * @returns {number}
   */
  private getPaymentExGainOrLoss = (billPayment: IBillPayment): number => {
    return sumBy(billPayment.entries, (entry) => {
      const paymentLocalAmount = entry.paymentAmount * billPayment.exchangeRate;
      const invoicePayment = entry.paymentAmount * entry.bill.exchangeRate;

      return invoicePayment - paymentLocalAmount;
    });
  };

  /**
   * Retrieves the payment exchange gain/loss entries.
   * @param   {IBillPayment} billPayment -
   * @param   {number} APAccountId -
   * @param   {number} gainLossAccountId -
   * @param   {string} baseCurrency -
   * @returns {ILedgerEntry[]}
   */
  private getPaymentExGainOrLossEntries = (
    billPayment: IBillPayment,
    APAccountId: number,
    gainLossAccountId: number,
    baseCurrency: string
  ): ILedgerEntry[] => {
    const commonEntry = this.getPaymentCommonEntry(billPayment);
    const totalExGainOrLoss = this.getPaymentExGainOrLoss(billPayment);
    const absExGainOrLoss = Math.abs(totalExGainOrLoss);

    return totalExGainOrLoss
      ? [
          {
            ...commonEntry,
            currencyCode: baseCurrency,
            exchangeRate: 1,
            credit: totalExGainOrLoss > 0 ? absExGainOrLoss : 0,
            debit: totalExGainOrLoss < 0 ? absExGainOrLoss : 0,
            accountId: gainLossAccountId,
            index: 2,
            indexGroup: 20,
            accountNormal: AccountNormal.DEBIT,
          },
          {
            ...commonEntry,
            currencyCode: baseCurrency,
            exchangeRate: 1,
            debit: totalExGainOrLoss > 0 ? absExGainOrLoss : 0,
            credit: totalExGainOrLoss < 0 ? absExGainOrLoss : 0,
            accountId: APAccountId,
            index: 3,
            accountNormal: AccountNormal.DEBIT,
          },
        ]
      : [];
  };

  /**
   * Retrieves the payment deposit GL entry.
   * @param   {IBillPayment} billPayment
   * @returns {ILedgerEntry}
   */
  private getPaymentGLEntry = (billPayment: IBillPayment): ILedgerEntry => {
    const commonEntry = this.getPaymentCommonEntry(billPayment);

    return {
      ...commonEntry,
      credit: billPayment.localAmount,
      accountId: billPayment.paymentAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 2,
    };
  };

  /**
   * Retrieves the payment GL payable entry.
   * @param {IBillPayment} billPayment
   * @param {number} APAccountId
   * @returns {ILedgerEntry}
   */
  private getPaymentGLPayableEntry = (
    billPayment: IBillPayment,
    APAccountId: number
  ): ILedgerEntry => {
    const commonEntry = this.getPaymentCommonEntry(billPayment);

    return {
      ...commonEntry,
      exchangeRate: billPayment.exchangeRate,
      debit: billPayment.localAmount,
      contactId: billPayment.vendorId,
      accountId: APAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  };

  /**
   * Retrieves the payment GL entries.
   * @param   {IBillPayment} billPayment
   * @param   {number} APAccountId
   * @returns {ILedgerEntry[]}
   */
  private getPaymentGLEntries = (
    billPayment: IBillPayment,
    APAccountId: number,
    gainLossAccountId: number,
    baseCurrency: string
  ): ILedgerEntry[] => {
    // Retrieves the payment deposit entry.
    const paymentEntry = this.getPaymentGLEntry(billPayment);

    // Retrieves the payment debit A/R entry.
    const payableEntry = this.getPaymentGLPayableEntry(
      billPayment,
      APAccountId
    );
    // Retrieves the exchange gain/loss entries.
    const exGainLossEntries = this.getPaymentExGainOrLossEntries(
      billPayment,
      APAccountId,
      gainLossAccountId,
      baseCurrency
    );
    return [paymentEntry, payableEntry, ...exGainLossEntries];
  };

  /**
   * Retrieves the bill payment ledger.
   * @param   {IBillPayment} billPayment
   * @param   {number} APAccountId
   * @returns {Ledger}
   */
  private getBillPaymentLedger = (
    billPayment: IBillPayment,
    APAccountId: number,
    gainLossAccountId: number,
    baseCurrency: string
  ): Ledger => {
    const entries = this.getPaymentGLEntries(
      billPayment,
      APAccountId,
      gainLossAccountId,
      baseCurrency
    );
    return new Ledger(entries);
  };
}
