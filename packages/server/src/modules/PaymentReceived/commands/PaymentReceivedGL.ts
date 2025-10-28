import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { PaymentReceived } from '../models/PaymentReceived';
import { sumBy } from 'lodash';
import { AccountNormal } from '@/interfaces/Account';
import { Ledger } from '@/modules/Ledger/Ledger';

export class PaymentReceivedGL {
  private readonly paymentReceived: PaymentReceived;
  private ARAccountId: number;
  private exchangeGainOrLossAccountId: number;
  private baseCurrencyCode: string;

  /**
   * Constructor method.
   * @param {PaymentReceived} paymentReceived - Payment received.
   */
  constructor(paymentReceived: PaymentReceived) {
    this.paymentReceived = paymentReceived;
  }

  /**
   * Sets the A/R account ID.
   * @param {number} ARAccountId - A/R account ID.
   * @returns {PaymentReceivedGL}
   */
  setARAccountId(ARAccountId: number) {
    this.ARAccountId = ARAccountId;
    return this;
  }

  /**
   * Sets the exchange gain/loss account ID.
   * @param {number} exchangeGainOrLossAccountId - Exchange gain/loss account ID.
   * @returns {PaymentReceivedGL}
   */
  setExchangeGainOrLossAccountId(exchangeGainOrLossAccountId: number) {
    this.exchangeGainOrLossAccountId = exchangeGainOrLossAccountId;
    return this;
  }

  /**
   * Sets the base currency code.
   * @param {string} baseCurrencyCode - Base currency code.
   * @returns {PaymentReceivedGL}
   */
  setBaseCurrencyCode(baseCurrencyCode: string) {
    this.baseCurrencyCode = baseCurrencyCode;
    return this;
  }

  /**
   * Calculates the payment total exchange gain/loss.
   * @param   {IBillPayment} paymentReceive - Payment receive with entries.
   * @returns {number}
   */
  private paymentExGainOrLoss = (): number => {
    return sumBy(this.paymentReceived.entries, (entry) => {
      const paymentLocalAmount =
        entry.paymentAmount * this.paymentReceived.exchangeRate;
      const invoicePayment = entry.paymentAmount * entry.invoice.exchangeRate;

      return paymentLocalAmount - invoicePayment;
    });
  };

  /**
   * Retrieves the common entry of payment receive.
   */
  private get paymentReceiveCommonEntry() {
    return {
      debit: 0,
      credit: 0,

      currencyCode: this.paymentReceived.currencyCode,
      exchangeRate: this.paymentReceived.exchangeRate,

      transactionId: this.paymentReceived.id,
      transactionType: 'PaymentReceive',

      transactionNumber: this.paymentReceived.paymentReceiveNo,
      referenceNumber: this.paymentReceived.referenceNo,

      date: this.paymentReceived.paymentDate,
      userId: this.paymentReceived.userId,
      createdAt: this.paymentReceived.createdAt,

      branchId: this.paymentReceived.branchId,
    };
  }

  /**
   * Retrieves the payment exchange gain/loss entry.
   * @param   {IPaymentReceived} paymentReceive -
   * @param   {number} ARAccountId -
   * @param   {number} exchangeGainOrLossAccountId -
   * @param   {string} baseCurrencyCode -
   * @returns {ILedgerEntry[]}
   */
  private get paymentExchangeGainLossEntry(): ILedgerEntry[] {
    const commonJournal = this.paymentReceiveCommonEntry;
    const gainOrLoss = this.paymentExGainOrLoss();
    const absGainOrLoss = Math.abs(gainOrLoss);

    return gainOrLoss
      ? [
          {
            ...commonJournal,
            currencyCode: this.baseCurrencyCode,
            exchangeRate: 1,
            debit: gainOrLoss > 0 ? absGainOrLoss : 0,
            credit: gainOrLoss < 0 ? absGainOrLoss : 0,
            accountId: this.ARAccountId,
            contactId: this.paymentReceived.customerId,
            index: 3,
            accountNormal: AccountNormal.CREDIT,
          },
          {
            ...commonJournal,
            currencyCode: this.baseCurrencyCode,
            exchangeRate: 1,
            credit: gainOrLoss > 0 ? absGainOrLoss : 0,
            debit: gainOrLoss < 0 ? absGainOrLoss : 0,
            accountId: this.exchangeGainOrLossAccountId,
            index: 3,
            accountNormal: AccountNormal.DEBIT,
          },
        ]
      : [];
  }

  /**
   * Retrieves the payment deposit GL entry.
   * @param {IPaymentReceived} paymentReceive
   * @returns {ILedgerEntry}
   */
  private get paymentDepositGLEntry(): ILedgerEntry {
    const commonJournal = this.paymentReceiveCommonEntry;

    return {
      ...commonJournal,
      debit: this.paymentReceived.localAmount,
      accountId: this.paymentReceived.depositAccountId,
      index: 2,
      accountNormal: AccountNormal.DEBIT,
    };
  }

  /**
   * Retrieves the payment receivable entry.
   * @param   {IPaymentReceived} paymentReceive
   * @param   {number} ARAccountId
   * @returns {ILedgerEntry}
   */
  private get paymentReceivableEntry(): ILedgerEntry {
    const commonJournal = this.paymentReceiveCommonEntry;

    return {
      ...commonJournal,
      credit: this.paymentReceived.localAmount,
      contactId: this.paymentReceived.customerId,
      accountId: this.ARAccountId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  }

  /**
   * Records payment receive journal transactions.
   *
   * Invoice payment journals.
   * --------
   * - Account receivable -> Debit
   * - Payment account [current asset] -> Credit
   * @returns {Promise<ILedgerEntry>}
   */
  public GLEntries(): ILedgerEntry[] {
    // Retrieve the payment deposit entry.
    const paymentDepositEntry = this.paymentDepositGLEntry;

    // Retrieves the A/R entry.
    const receivableEntry = this.paymentReceivableEntry;

    // Exchange gain/loss entries.
    const gainLossEntries = this.paymentExchangeGainLossEntry;

    return [paymentDepositEntry, receivableEntry, ...gainLossEntries];
  }

  /**
   * Retrieves the payment receive ledger.
   * @returns {Ledger}
   */
  public getLedger = (): Ledger => {
    return new Ledger(this.GLEntries());
  };
}
