import * as moment from 'moment';
import { defaultTo } from 'lodash';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { AccountNormal } from '@/interfaces/Account';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { BillPayment } from '../models/BillPayment';
import { BillPaymentEntry } from '../models/BillPaymentEntry';

/**
 * Records the cash basis journal entries of the bill payment.
 * The cash basis recognizes the purchase expenses of the associated bill(s)
 * once the payment is made instead of the accounts payable.
 *
 * The entries mirror the expense composition of the bill (the cost/inventory
 * accounts, tax payable, discount, and other charges) scaled by the paid
 * proportion of the bill.
 */
export class BillPaymentCashGL {
  private readonly billPayment: BillPayment;

  private taxPayableAccountId: number;
  private purchaseDiscountAccountId: number;
  private otherExpensesAccountId: number;

  /**
   * Constructor method.
   * @param {BillPayment} billPayment - Bill payment.
   */
  constructor(billPayment: BillPayment) {
    this.billPayment = billPayment;
  }

  /**
   * Sets the tax payable account id.
   * @param {number} taxPayableAccountId - Tax payable account id.
   * @returns {BillPaymentCashGL}
   */
  setTaxPayableAccountId(taxPayableAccountId: number) {
    this.taxPayableAccountId = taxPayableAccountId;
    return this;
  }

  /**
   * Sets the purchase discount account id.
   * @param {number} purchaseDiscountAccountId - Purchase discount account id.
   * @returns {BillPaymentCashGL}
   */
  setPurchaseDiscountAccountId(purchaseDiscountAccountId: number) {
    this.purchaseDiscountAccountId = purchaseDiscountAccountId;
    return this;
  }

  /**
   * Sets the other expenses account id.
   * @param {number} otherExpensesAccountId - Other expenses account id.
   * @returns {BillPaymentCashGL}
   */
  setOtherExpensesAccountId(otherExpensesAccountId: number) {
    this.otherExpensesAccountId = otherExpensesAccountId;
    return this;
  }

  /**
   * Retrieves the common journal entry of the cash basis entries.
   */
  private get cashEntriesCommonEntry() {
    return {
      credit: 0,
      debit: 0,

      currencyCode: this.billPayment.currencyCode,
      exchangeRate: this.billPayment.exchangeRate,

      transactionId: this.billPayment.id,
      transactionType: 'BillPayment',

      transactionNumber: this.billPayment.paymentNumber,
      referenceNumber: this.billPayment.reference,

      date: moment(this.billPayment.paymentDate).format('YYYY-MM-DD'),
      createdAt: this.billPayment.createdAt,

      branchId: this.billPayment.branchId,

      indexGroup: 50,

      basis: 'cash' as const,
    };
  }

  /**
   * Retrieves the paid amount of the given payment entry in local currency.
   * @param {BillPaymentEntry} entry - Bill payment entry.
   * @returns {number}
   */
  private getPaymentEntryLocalAmount = (entry: BillPaymentEntry): number => {
    return entry.paymentAmount * defaultTo(this.billPayment.exchangeRate, 1);
  };

  /**
   * Retrieves the paid proportion of the associated bill.
   * The paid amount in local currency over the bill total in local currency
   * keeps the cash basis entries balanced for partial payments.
   * @param {BillPaymentEntry} entry - Bill payment entry.
   * @returns {number}
   */
  private getPaymentEntryRatio = (entry: BillPaymentEntry): number => {
    const billTotalLocal = defaultTo(entry.bill?.totalLocal, 0);
    const paidLocalAmount = this.getPaymentEntryLocalAmount(entry);

    if (billTotalLocal <= 0) {
      return 0;
    }
    return paidLocalAmount / billTotalLocal;
  };

  /**
   * Retrieves the cash basis entries of the given payment entry (bill allocation).
   * @param {BillPaymentEntry} entry - Bill payment entry.
   * @returns {ILedgerEntry[]}
   */
  private getPaymentEntryCashEntries = (
    entry: BillPaymentEntry,
  ): ILedgerEntry[] => {
    const bill = entry.bill;
    const ratio = this.getPaymentEntryRatio(entry);

    if (!bill || ratio <= 0) {
      return [];
    }
    const commonEntry = this.cashEntriesCommonEntry;
    const billEntries = bill.entries || [];
    const billExchangeRate = defaultTo(bill.exchangeRate, 1);

    // Payment account (cash/bank) credit entry of the paid amount.
    const paymentEntry: ILedgerEntry = {
      ...commonEntry,
      credit: this.getPaymentEntryLocalAmount(entry),
      accountId: this.billPayment.paymentAccountId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };

    // Cost/inventory accounts debit entries mirroring the bill items.
    const itemsEntries: ILedgerEntry[] = billEntries.map((item, index) =>
      this.getBillItemCashEntry(item, index, ratio, billExchangeRate),
    );

    // Tax payable debit entries mirroring the bill taxes.
    const taxEntries: ILedgerEntry[] = billEntries
      .filter((item) => item.taxAmount > 0)
      .map((item, index) => ({
        ...commonEntry,
        debit: item.taxAmount * billExchangeRate * ratio,
        accountId: this.taxPayableAccountId,
        index: billEntries.length + index + 2,
        accountNormal: AccountNormal.CREDIT,
        taxRateId: item.taxRateId,
        taxRate: item.taxRate,
      }));

    // Discount entry mirroring the bill discount.
    const discountEntry: ILedgerEntry[] = bill.discountAmountLocal
      ? [
          {
            ...commonEntry,
            credit: bill.discountAmountLocal * ratio,
            accountId: this.purchaseDiscountAccountId,
            accountNormal: AccountNormal.DEBIT,
            index: 1,
          },
        ]
      : [];

    // Other charges (adjustment) entry mirroring the bill adjustment.
    const adjustmentAmount = defaultTo(bill.adjustmentLocal, 0);
    const adjustmentEntry: ILedgerEntry[] = bill.adjustmentLocal
      ? [
          {
            ...commonEntry,
            debit: adjustmentAmount > 0 ? adjustmentAmount * ratio : 0,
            credit:
              adjustmentAmount < 0 ? Math.abs(adjustmentAmount) * ratio : 0,
            accountId: this.otherExpensesAccountId,
            accountNormal: AccountNormal.DEBIT,
            index: 1,
          },
        ]
      : [];

    return [
      paymentEntry,
      ...itemsEntries,
      ...taxEntries,
      ...discountEntry,
      ...adjustmentEntry,
    ];
  };

  /**
   * Retrieves the cash basis entry of the given bill item.
   * @param {ItemEntry} item - Bill item entry.
   * @param {number} index - Item entry index.
   * @param {number} ratio - Paid proportion of the bill.
   * @param {number} billExchangeRate - Bill exchange rate.
   * @returns {ILedgerEntry}
   */
  private getBillItemCashEntry = (
    item: ItemEntry,
    index: number,
    ratio: number,
    billExchangeRate: number,
  ): ILedgerEntry => {
    return {
      ...this.cashEntriesCommonEntry,
      debit: item.totalExcludingTax * billExchangeRate * ratio,
      accountId:
        ['inventory'].indexOf(item.item.type) !== -1
          ? item.item.inventoryAccountId
          : item.costAccountId,
      index: index + 2,
      itemId: item.itemId,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieves the bill payment cash basis GL entries.
   * @returns {ILedgerEntry[]}
   */
  public GLEntries(): ILedgerEntry[] {
    return (this.billPayment.entries || []).flatMap(
      this.getPaymentEntryCashEntries,
    );
  }

  /**
   * Retrieves the bill payment cash basis ledger.
   * @returns {Ledger}
   */
  public getLedger = (): Ledger => {
    return new Ledger(this.GLEntries());
  };
}
