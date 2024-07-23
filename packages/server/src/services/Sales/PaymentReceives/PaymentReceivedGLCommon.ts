import { Knex } from 'knex';
import { sumBy } from 'lodash';
import {
  AccountNormal,
  ILedgerEntry,
  IPaymentReceive,
  IPaymentReceiveGLCommonEntry,
} from '@/interfaces';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';

export class PaymentReceivedGLCommon {
  private ledgerStorage: LedgerStorageService;

  /**
   * Retrieves the common entry of payment receive.
   * @param {IPaymentReceive} paymentReceive
   * @returns {IPaymentReceiveGLCommonEntry}
   */
  protected getPaymentReceiveCommonEntry = (
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
  protected getPaymentExchangeGainLossEntry = (
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
   * Calculates the payment total exchange gain/loss.
   * @param {IBillPayment} paymentReceive - Payment receive with entries.
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
}
