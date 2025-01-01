import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { VendorCredit } from '../models/VendorCredit';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { AccountNormal } from '@/interfaces/Account';
import { Ledger } from '@/modules/Ledger/Ledger';

export class VendorCreditGL {
  private APAccountId: number;
  private purchaseDiscountAccountId: number;
  private otherExpensesAccountId: number;

  constructor(private vendorCredit: VendorCredit) {}

  /**
   * Sets the payable account (A/P) ID.
   * @param {number} APAccountId
   * @returns {VendorCreditGL}
   */
  public setAPAccountId(APAccountId: number) {
    this.APAccountId = APAccountId;
    return this;
  }

  /**
   * Sets the purchase discount account ID.
   * @param {number} purchaseDiscountAccountId
   * @returns {VendorCreditGL}
   */
  public setPurchaseDiscountAccountId(purchaseDiscountAccountId: number) {
    this.purchaseDiscountAccountId = purchaseDiscountAccountId;
    return this;
  }

  /**
   * Sets the other expenses account ID.
   * @param {number} otherExpensesAccountId
   * @returns {VendorCreditGL}
   */
  public setOtherExpensesAccountId(otherExpensesAccountId: number) {
    this.otherExpensesAccountId = otherExpensesAccountId;
    return this;
  }

  /**
   * Retrieve the vendor credit GL common entry.
   * @param {IVendorCredit} vendorCredit
   */
  public get vendorCreditGLCommonEntry() {
    return {
      date: this.vendorCredit.vendorCreditDate,
      currencyCode: this.vendorCredit.currencyCode,
      exchangeRate: this.vendorCredit.exchangeRate,

      transactionId: this.vendorCredit.id,
      transactionType: 'VendorCredit',
      transactionNumber: this.vendorCredit.vendorCreditNumber,
      referenceNumber: this.vendorCredit.referenceNo,

      credit: 0,
      debit: 0,

      branchId: this.vendorCredit.branchId,
    };
  }

  /**
   * Retrieves the vendor credit payable GL entry.
   * @returns {ILedgerEntry}
   */
  public get vendorCreditPayableGLEntry(): ILedgerEntry {
    const commonEntity = this.vendorCreditGLCommonEntry;

    return {
      ...commonEntity,
      debit: this.vendorCredit.totalLocal,
      accountId: this.APAccountId,
      contactId: this.vendorCredit.vendorId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
    };
  }

  /**
   * Retrieves the vendor credit item GL entry.
   * @returns {ILedgerEntry}
   */
  public getVendorCreditGLItemEntry(
    entry: ItemEntry,
    index: number,
  ): ILedgerEntry {
    const commonEntity = this.vendorCreditGLCommonEntry;
    const totalLocal = entry.totalExcludingTax * this.vendorCredit.exchangeRate;

    return {
      ...commonEntity,
      credit: totalLocal,
      index: index + 2,
      itemId: entry.itemId,
      // itemQuantity: entry.quantity,
      accountId:
        'inventory' === entry.item.type
          ? entry.item.inventoryAccountId
          : entry.costAccountId || entry.item.costAccountId,
      accountNormal: AccountNormal.DEBIT,
    };
  }

  /**
   * Retrieves the vendor credit discount GL entry.
   * @returns {ILedgerEntry}
   */
  public get discountEntry(): ILedgerEntry {
    const commonEntry = this.vendorCreditGLCommonEntry;

    return {
      ...commonEntry,
      debit: this.vendorCredit.discountAmountLocal,
      accountId: this.purchaseDiscountAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
      indexGroup: 40,
    };
  }

  /**
   * Retrieves the vendor credit adjustment GL entry.
   * @returns {ILedgerEntry}
   */
  public get adjustmentEntry(): ILedgerEntry {
    const commonEntry = this.vendorCreditGLCommonEntry;
    const adjustmentAmount = Math.abs(this.vendorCredit.adjustmentLocal);

    return {
      ...commonEntry,
      credit: this.vendorCredit.adjustmentLocal > 0 ? adjustmentAmount : 0,
      debit: this.vendorCredit.adjustmentLocal < 0 ? adjustmentAmount : 0,
      accountId: this.otherExpensesAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
      indexGroup: 40,
    };
  }

  /**
   * Retrieve the vendor credit GL entries.
   * @return {ILedgerEntry[]}
   */
  public getVendorCreditGLEntries(): ILedgerEntry[] {
    const payableEntry = this.vendorCreditPayableGLEntry;
    const getItemEntry = this.getVendorCreditGLItemEntry;
    const itemsEntries = this.vendorCredit.entries.map(getItemEntry);

    const discountEntry = this.discountEntry;
    const adjustmentEntry = this.adjustmentEntry;

    return [payableEntry, discountEntry, adjustmentEntry, ...itemsEntries];
  }

  /**
   * Retrieves the vendor credit ledger.
   * @returns {Ledger}
   */
  public getVendorCreditLedger(): Ledger {
    const entries = this.getVendorCreditGLEntries();
    return new Ledger(entries);
  }
}
