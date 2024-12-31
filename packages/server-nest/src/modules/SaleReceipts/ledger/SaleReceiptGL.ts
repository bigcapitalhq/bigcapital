import * as R from 'ramda';
import { ILedger } from '@/modules/Ledger/types/Ledger.types';
import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { SaleReceipt } from '../models/SaleReceipt';
import { ItemEntry } from '@/modules/Items/models/ItemEntry';

export class SaleReceiptGL {
  private saleReceipt: SaleReceipt;
  private discountAccountId: number;
  private otherChargesAccountId: number;

  /**
   * Constructor method.
   * @param {SaleReceipt} saleReceipt - Sale receipt.
   */
  constructor(saleReceipt: SaleReceipt) {
    this.saleReceipt = saleReceipt;
  }

  /**
   * Sets the discount account id.
   * @param {number} discountAccountId - Discount account id.
   */
  setDiscountAccountId(discountAccountId: number) {
    this.discountAccountId = discountAccountId;
    return this;
  }

  /**
   * Sets the other charges account id.
   * @param {number} otherChargesAccountId - Other charges account id.
   */
  setOtherChargesAccountId(otherChargesAccountId: number) {
    this.otherChargesAccountId = otherChargesAccountId;
    return this;
  }

  /**
   * Retrieves the income GL common entry.
   */
  private getIncomeGLCommonEntry = () => {
    return {
      currencyCode: this.saleReceipt.currencyCode,
      exchangeRate: this.saleReceipt.exchangeRate,

      transactionType: 'SaleReceipt',
      transactionId: this.saleReceipt.id,

      date: this.saleReceipt.receiptDate,

      transactionNumber: this.saleReceipt.receiptNumber,
      referenceNumber: this.saleReceipt.referenceNo,

      createdAt: this.saleReceipt.createdAt,

      credit: 0,
      debit: 0,

      userId: this.saleReceipt.userId,
      branchId: this.saleReceipt.branchId,
    };
  };

  /**
   * Retrieve receipt income item G/L entry.
   * @param {ItemEntry} entry - Item entry.
   * @param {number} index - Index.
   * @returns {ILedgerEntry}
   */
  private getReceiptIncomeItemEntry = R.curry(
    (entry: ItemEntry, index: number): ILedgerEntry => {
      const commonEntry = this.getIncomeGLCommonEntry();
      const totalLocal =
        entry.totalExcludingTax * this.saleReceipt.exchangeRate;

      return {
        ...commonEntry,
        credit: totalLocal,
        accountId: entry.item.sellAccountId,
        note: entry.description,
        index: index + 2,
        itemId: entry.itemId,
        itemQuantity: entry.quantity,
        accountNormal: AccountNormal.CREDIT,
      };
    },
  );

  /**
   * Retrieves the receipt deposit GL deposit entry.
   * @returns {ILedgerEntry}
   */
  private getReceiptDepositEntry = (): ILedgerEntry => {
    const commonEntry = this.getIncomeGLCommonEntry();

    return {
      ...commonEntry,
      debit: this.saleReceipt.totalLocal,
      accountId: this.saleReceipt.depositAccountId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieves the discount GL entry.
   * @returns {ILedgerEntry}
   */
  private getDiscountEntry = (): ILedgerEntry => {
    const commonEntry = this.getIncomeGLCommonEntry();

    return {
      ...commonEntry,
      debit: this.saleReceipt.discountAmountLocal,
      accountId: this.discountAccountId,
      index: 1,
      accountNormal: AccountNormal.CREDIT,
    };
  };

  /**
   * Retrieves the adjustment GL entry.
   * @returns {ILedgerEntry}
   */
  private getAdjustmentEntry = (): ILedgerEntry => {
    const commonEntry = this.getIncomeGLCommonEntry();
    const adjustmentAmount = Math.abs(this.saleReceipt.adjustmentLocal);

    return {
      ...commonEntry,
      debit: this.saleReceipt.adjustmentLocal < 0 ? adjustmentAmount : 0,
      credit: this.saleReceipt.adjustmentLocal > 0 ? adjustmentAmount : 0,
      accountId: this.otherChargesAccountId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  };

  /**
   * Retrieves the income GL entries.
   * @returns {ILedgerEntry[]}
   */
  public getIncomeGLEntries = (): ILedgerEntry[] => {
    const getItemEntry = this.getReceiptIncomeItemEntry;

    const creditEntries = this.saleReceipt.entries.map((e, index) =>
      getItemEntry(e, index),
    );
    const depositEntry = this.getReceiptDepositEntry();
    const discountEntry = this.getDiscountEntry();
    const adjustmentEntry = this.getAdjustmentEntry();

    return [depositEntry, ...creditEntries, discountEntry, adjustmentEntry];
  };

  /**
   * Retrieves the income GL ledger.
   * @returns {ILedger}
   */
  public getIncomeLedger = (): ILedger => {
    const entries = this.getIncomeGLEntries();

    return new Ledger(entries);
  };
}
