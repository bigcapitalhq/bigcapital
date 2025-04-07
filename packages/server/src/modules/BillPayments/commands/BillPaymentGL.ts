import { sumBy } from 'lodash';
import { BillPayment } from '../models/BillPayment';
import { AccountNormal } from '@/interfaces/Account';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';

export class BillPaymentGL {
  private billPayment: BillPayment;
  private APAccountId: number;
  private gainLossAccountId: number;
  private baseCurrency: string;

  constructor(billPayment: BillPayment) {
    this.billPayment = billPayment;
  }

  /**
   * Sets the A/P account ID.
   * @param {number} APAccountId -
   * @returns {BillPaymentGL}
   */
  setAPAccountId(APAccountId: number) {
    this.APAccountId = APAccountId;
    return this;
  }

  /**
   * Sets the gain/loss account ID.
   * @param {number} gainLossAccountId -
   * @returns {BillPaymentGL}
   */
  setGainLossAccountId(gainLossAccountId: number) {
    this.gainLossAccountId = gainLossAccountId;
    return this;
  }

  /**
   * Sets the base currency.
   * @param {string} baseCurrency -
   * @returns {BillPaymentGL}
   */
  setBaseCurrency(baseCurrency: string) {
    this.baseCurrency = baseCurrency;
    return this;
  }

  /**
   * Retrieves the payment common entry.
   */
  private get paymentCommonEntry() {
    const formattedDate = moment(this.billPayment.paymentDate).format(
      'YYYY-MM-DD',
    );

    return {
      debit: 0,
      credit: 0,

      exchangeRate: this.billPayment.exchangeRate,
      currencyCode: this.billPayment.currencyCode,

      transactionId: this.billPayment.id,
      transactionType: 'BillPayment',

      transactionNumber: this.billPayment.paymentNumber,
      referenceNumber: this.billPayment.reference,

      date: formattedDate,
      createdAt: this.billPayment.createdAt,

      branchId: this.billPayment.branchId,
    };
  }

  /**
   * Calculates the payment total exchange gain/loss.
   * @param   {IBillPayment} paymentReceive - Payment receive with entries.
   * @returns {number}
   */
  private get paymentExGainOrLoss(): number {
    return sumBy(this.billPayment.entries, (entry) => {
      const paymentLocalAmount =
        entry.paymentAmount * this.billPayment.exchangeRate;
      const invoicePayment = entry.paymentAmount * entry.bill.exchangeRate;

      return invoicePayment - paymentLocalAmount;
    });
  }

  /**
   * Retrieves the payment exchange gain/loss entries.
   * @returns {ILedgerEntry[]}
   */
  private get paymentExGainOrLossEntries(): ILedgerEntry[] {
    const commonEntry = this.paymentCommonEntry;
    const totalExGainOrLoss = this.paymentExGainOrLoss;
    const absExGainOrLoss = Math.abs(totalExGainOrLoss);

    return totalExGainOrLoss
      ? [
          {
            ...commonEntry,
            currencyCode: this.baseCurrency,
            exchangeRate: 1,
            credit: totalExGainOrLoss > 0 ? absExGainOrLoss : 0,
            debit: totalExGainOrLoss < 0 ? absExGainOrLoss : 0,
            accountId: this.gainLossAccountId,
            index: 2,
            indexGroup: 20,
            accountNormal: AccountNormal.DEBIT,
          },
          {
            ...commonEntry,
            currencyCode: this.baseCurrency,
            exchangeRate: 1,
            debit: totalExGainOrLoss > 0 ? absExGainOrLoss : 0,
            credit: totalExGainOrLoss < 0 ? absExGainOrLoss : 0,
            accountId: this.APAccountId,
            index: 3,
            accountNormal: AccountNormal.DEBIT,
          },
        ]
      : [];
  }

  /**
   * Retrieves the payment deposit GL entry.
   * @param   {IBillPayment} billPayment
   * @returns {ILedgerEntry}
   */
  private get paymentGLEntry(): ILedgerEntry {
    const commonEntry = this.paymentCommonEntry;

    return {
      ...commonEntry,
      credit: this.billPayment.localAmount,
      accountId: this.billPayment.paymentAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 2,
    };
  }

  /**
   * Retrieves the payment GL payable entry.
   * @returns {ILedgerEntry}
   */
  private get paymentGLPayableEntry(): ILedgerEntry {
    const commonEntry = this.paymentCommonEntry;

    return {
      ...commonEntry,
      exchangeRate: this.billPayment.exchangeRate,
      debit: this.billPayment.localAmount,
      contactId: this.billPayment.vendorId,
      accountId: this.APAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  }

  /**
   * Retrieves the payment GL entries.
   * @param   {IBillPayment} billPayment
   * @param   {number} APAccountId
   * @returns {ILedgerEntry[]}
   */
  private get paymentGLEntries(): ILedgerEntry[] {
    // Retrieves the payment deposit entry.
    const paymentEntry = this.paymentGLEntry;

    // Retrieves the payment debit A/R entry.
    const payableEntry = this.paymentGLPayableEntry;

    // Retrieves the exchange gain/loss entries.
    const exGainLossEntries = this.paymentExGainOrLossEntries;

    return [paymentEntry, payableEntry, ...exGainLossEntries];
  };

  /**
   * Retrieves the bill payment ledger.
   * @param   {IBillPayment} billPayment
   * @param   {number} APAccountId
   * @returns {Ledger}
   */
  public getBillPaymentLedger(): Ledger {
    const entries = this.paymentGLEntries;

    return new Ledger(entries);
  }
}
