import { Service, Inject } from 'typedi';
import { sumBy } from 'lodash';
import { Knex } from 'knex';
import Ledger from '@/services/Accounting/Ledger';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  IPaymentReceive,
  ILedgerEntry,
  AccountNormal,
  IPaymentReceiveGLCommonEntry,
} from '@/interfaces';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import { TenantMetadata } from '@/system/models';

@Service()
export class PaymentReceiveGLEntries {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Writes payment GL entries to the storage.
   * @param   {number} tenantId
   * @param   {number} paymentReceiveId
   * @param   {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public writePaymentGLEntries = async (
    tenantId: number,
    paymentReceiveId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Retrieves the payment receive with associated entries.
    const paymentReceive = await PaymentReceive.query(trx)
      .findById(paymentReceiveId)
      .withGraphFetched('entries.invoice');

    // Retrives the payment receive ledger.
    const ledger = await this.getPaymentReceiveGLedger(
      tenantId,
      paymentReceive,
      tenantMeta.baseCurrency,
      trx
    );
    // Commit the ledger entries to the storage.
    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Reverts the given payment receive GL entries.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {Knex.Transaction} trx
   */
  public revertPaymentGLEntries = async (
    tenantId: number,
    paymentReceiveId: number,
    trx?: Knex.Transaction
  ) => {
    await this.ledgerStorage.deleteByReference(
      tenantId,
      paymentReceiveId,
      'PaymentReceive',
      trx
    );
  };

  /**
   * Rewrites the given payment receive GL entries.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {Knex.Transaction} trx
   */
  public rewritePaymentGLEntries = async (
    tenantId: number,
    paymentReceiveId: number,
    trx?: Knex.Transaction
  ) => {
    // Reverts the payment GL entries.
    await this.revertPaymentGLEntries(tenantId, paymentReceiveId, trx);

    // Writes the payment GL entries.
    await this.writePaymentGLEntries(tenantId, paymentReceiveId, trx);
  };

  /**
   * Retrieves the payment receive general ledger.
   * @param   {number} tenantId -
   * @param   {IPaymentReceive} paymentReceive -
   * @param   {string} baseCurrencyCode -
   * @param   {Knex.Transaction} trx -
   * @returns {Ledger}
   */
  public getPaymentReceiveGLedger = async (
    tenantId: number,
    paymentReceive: IPaymentReceive,
    baseCurrencyCode: string,
    trx?: Knex.Transaction
  ): Promise<Ledger> => {
    const { Account } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the A/R account of the given currency.
    const receivableAccount =
      await accountRepository.findOrCreateAccountReceivable(
        paymentReceive.currencyCode
      );
    // Exchange gain/loss account.
    const exGainLossAccount = await Account.query(trx).modify(
      'findBySlug',
      'exchange-grain-loss'
    );
    const ledgerEntries = this.getPaymentReceiveGLEntries(
      paymentReceive,
      receivableAccount.id,
      exGainLossAccount.id,
      baseCurrencyCode
    );
    return new Ledger(ledgerEntries);
  };

  /**
   * Calculates the payment total exchange gain/loss.
   * @param   {IBillPayment} paymentReceive - Payment receive with entries.
   * @returns {number}
   */
  private getPaymentExGainOrLoss = (
    paymentReceive: IPaymentReceive
  ): number => {
    return sumBy(paymentReceive.entries, (entry) => {
      const paymentLocalAmount =
        entry.paymentAmount * paymentReceive.exchangeRate;
      const invoicePayment = entry.paymentAmount * entry.invoice.exchangeRate;

      return paymentLocalAmount - invoicePayment;
    });
  };

  /**
   * Retrieves the common entry of payment receive.
   * @param   {IPaymentReceive} paymentReceive
   * @returns {}
   */
  private getPaymentReceiveCommonEntry = (
    paymentReceive: IPaymentReceive
  ): IPaymentReceiveGLCommonEntry => {
    return {
      debit: 0,
      credit: 0,

      currencyCode: paymentReceive.currencyCode,
      exchangeRate: paymentReceive.exchangeRate,

      transactionId: paymentReceive.id,
      transactionType: 'PaymentReceive',

      transactionNumber: paymentReceive.paymentReceiveNo,
      referenceNumber: paymentReceive.referenceNo,

      date: paymentReceive.paymentDate,
      userId: paymentReceive.userId,
      createdAt: paymentReceive.createdAt,

      branchId: paymentReceive.branchId,
    };
  };

  /**
   * Retrieves the payment exchange gain/loss entry.
   * @param   {IPaymentReceive} paymentReceive -
   * @param   {number} ARAccountId -
   * @param   {number} exchangeGainOrLossAccountId -
   * @param   {string} baseCurrencyCode -
   * @returns {ILedgerEntry[]}
   */
  private getPaymentExchangeGainLossEntry = (
    paymentReceive: IPaymentReceive,
    ARAccountId: number,
    exchangeGainOrLossAccountId: number,
    baseCurrencyCode: string
  ): ILedgerEntry[] => {
    const commonJournal = this.getPaymentReceiveCommonEntry(paymentReceive);
    const gainOrLoss = this.getPaymentExGainOrLoss(paymentReceive);
    const absGainOrLoss = Math.abs(gainOrLoss);

    return gainOrLoss
      ? [
          {
            ...commonJournal,
            currencyCode: baseCurrencyCode,
            exchangeRate: 1,
            debit: gainOrLoss > 0 ? absGainOrLoss : 0,
            credit: gainOrLoss < 0 ? absGainOrLoss : 0,
            accountId: ARAccountId,
            contactId: paymentReceive.customerId,
            index: 3,
            accountNormal: AccountNormal.CREDIT,
          },
          {
            ...commonJournal,
            currencyCode: baseCurrencyCode,
            exchangeRate: 1,
            credit: gainOrLoss > 0 ? absGainOrLoss : 0,
            debit: gainOrLoss < 0 ? absGainOrLoss : 0,
            accountId: exchangeGainOrLossAccountId,
            index: 3,
            accountNormal: AccountNormal.DEBIT,
          },
        ]
      : [];
  };

  /**
   * Retrieves the payment deposit GL entry.
   * @param   {IPaymentReceive} paymentReceive
   * @returns {ILedgerEntry}
   */
  private getPaymentDepositGLEntry = (
    paymentReceive: IPaymentReceive
  ): ILedgerEntry => {
    const commonJournal = this.getPaymentReceiveCommonEntry(paymentReceive);

    return {
      ...commonJournal,
      debit: paymentReceive.localAmount,
      accountId: paymentReceive.depositAccountId,
      index: 2,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieves the payment receivable entry.
   * @param   {IPaymentReceive} paymentReceive
   * @param   {number} ARAccountId
   * @returns {ILedgerEntry}
   */
  private getPaymentReceivableEntry = (
    paymentReceive: IPaymentReceive,
    ARAccountId: number
  ): ILedgerEntry => {
    const commonJournal = this.getPaymentReceiveCommonEntry(paymentReceive);

    return {
      ...commonJournal,
      credit: paymentReceive.localAmount,
      contactId: paymentReceive.customerId,
      accountId: ARAccountId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Records payment receive journal transactions.
   *
   * Invoice payment journals.
   * --------
   * - Account receivable -> Debit
   * - Payment account [current asset] -> Credit
   *
   * @param   {number} tenantId
   * @param   {IPaymentReceive} paymentReceive - Payment receive model.
   * @param   {number} ARAccountId - A/R account id.
   * @param   {number} exGainOrLossAccountId - Exchange gain/loss account id.
   * @param   {string} baseCurrency - Base currency code.
   * @returns {Promise<ILedgerEntry>}
   */
  public getPaymentReceiveGLEntries = (
    paymentReceive: IPaymentReceive,
    ARAccountId: number,
    exGainOrLossAccountId: number,
    baseCurrency: string
  ): ILedgerEntry[] => {
    // Retrieve the payment deposit entry.
    const paymentDepositEntry = this.getPaymentDepositGLEntry(paymentReceive);

    // Retrieves the A/R entry.
    const receivableEntry = this.getPaymentReceivableEntry(
      paymentReceive,
      ARAccountId
    );
    // Exchange gain/loss entries.
    const gainLossEntries = this.getPaymentExchangeGainLossEntry(
      paymentReceive,
      ARAccountId,
      exGainOrLossAccountId,
      baseCurrency
    );
    return [paymentDepositEntry, receivableEntry, ...gainLossEntries];
  };
}
