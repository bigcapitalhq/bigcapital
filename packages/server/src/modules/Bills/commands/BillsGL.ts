import { sumBy } from 'lodash';
import * as moment from 'moment';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { Bill } from '../models/Bill';
import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { BillLandedCost } from '@/modules/BillLandedCosts/models/BillLandedCost';

export class BillGL {
  private bill: Bill;
  private payableAccountId: number;
  private taxPayableAccountId: number;
  private purchaseDiscountAccountId: number;
  private otherExpensesAccountId: number;

  constructor(bill: Bill) {
    this.bill = bill;
  }

  setPayableAccountId(payableAccountId: number) {
    this.payableAccountId = payableAccountId;
    return this;
  }

  setTaxPayableAccountId(taxPayableAccountId: number) {
    this.taxPayableAccountId = taxPayableAccountId;
    return this;
  }

  setPurchaseDiscountAccountId(purchaseDiscountAccountId: number) {
    this.purchaseDiscountAccountId = purchaseDiscountAccountId;
    return this;
  }

  setOtherExpensesAccountId(otherExpensesAccountId: number) {
    this.otherExpensesAccountId = otherExpensesAccountId;
    return this;
  }

  /**
   * Retrieves the bill common entry.
   * @returns {ILedgerEntry}
   */
  private get billCommonEntry() {
    return {
      debit: 0,
      credit: 0,

      currencyCode: this.bill.currencyCode,
      exchangeRate: this.bill.exchangeRate || 1,

      transactionId: this.bill.id,
      transactionType: 'Bill',

      date: moment(this.bill.billDate).format('YYYY-MM-DD'),
      userId: this.bill.userId,

      referenceNumber: this.bill.referenceNo,
      transactionNumber: this.bill.billNumber,

      branchId: this.bill.branchId,
      projectId: this.bill.projectId,

      createdAt: this.bill.createdAt,
    };
  }

  /**
   * Retrieves the bill item inventory/cost entry.
   * @param {ItemEntry} entry -
   * @param {number} index -
   */
  private getBillItemEntry(entry: ItemEntry, index: number): ILedgerEntry {
    const commonJournalMeta = this.billCommonEntry;
    const totalLocal = this.bill.exchangeRate * entry.totalExcludingTax;
    const landedCostAmount = sumBy(entry.allocatedCostEntries, 'cost');

    return {
      ...commonJournalMeta,
      debit: totalLocal + landedCostAmount,
      accountId:
        ['inventory'].indexOf(entry.item.type) !== -1
          ? entry.item.inventoryAccountId
          : entry.costAccountId,
      index: index + 1,
      indexGroup: 10,
      itemId: entry.itemId,
      accountNormal: AccountNormal.DEBIT,
    };
  }

  /**
   * Retrieves the bill landed cost entry.
   * @param {BillLandedCost} landedCost - Landed cost
   * @param {number} index - Index
   */
  private getBillLandedCostEntry(
    landedCost: BillLandedCost,
    index: number,
  ): ILedgerEntry {
    const commonJournalMeta = this.billCommonEntry;

    return {
      ...commonJournalMeta,
      credit: landedCost.amount,
      accountId: landedCost.costAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
      indexGroup: 20,
    };
  }

  /**
   * Retrieves the bill payable entry.
   * @returns {ILedgerEntry}
   */
  private get billPayableEntry(): ILedgerEntry {
    const commonJournalMeta = this.billCommonEntry;

    return {
      ...commonJournalMeta,
      credit: this.bill.totalLocal,
      accountId: this.payableAccountId,
      contactId: this.bill.vendorId,
      accountNormal: AccountNormal.CREDIT,
      index: 1,
      indexGroup: 5,
    };
  }

  /**
   * Retrieves the bill tax GL entry.
   * @param {IBill} bill -
   * @param {number} taxPayableAccountId -
   * @param {IItemEntry} entry -
   * @param {number} index -
   * @returns {ILedgerEntry}
   */
  private getBillTaxEntry(entry: ItemEntry, index: number): ILedgerEntry {
    const commonJournalMeta = this.billCommonEntry;

    return {
      ...commonJournalMeta,
      debit: entry.taxAmount,
      index,
      indexGroup: 30,
      accountId: this.taxPayableAccountId,
      accountNormal: AccountNormal.CREDIT,
      taxRateId: entry.taxRateId,
      taxRate: entry.taxRate,
    };
  }

  /**
   * Retrieves the bill tax GL entries.
   * @param {IBill} bill
   * @param {number} taxPayableAccountId
   * @returns {ILedgerEntry[]}
   */
  // private getBillTaxEntries = () => {
  //   // Retrieves the non-zero tax entries.
  //   const nonZeroTaxEntries = this.itemsEntriesService.getNonZeroEntries(
  //     this.bill.entries,
  //   );
  //   const transformTaxEntry = this.getBillTaxEntry(
  //     this.bill,
  //     this.taxPayableAccountId,
  //   );

  //   return nonZeroTaxEntries.map(transformTaxEntry);
  // };

  /**
   * Retrieves the purchase discount GL entry.
   * @returns {ILedgerEntry}
   */
  private get purchaseDiscountEntry(): ILedgerEntry {
    const commonEntry = this.billCommonEntry;

    return {
      ...commonEntry,
      credit: this.bill.discountAmountLocal,
      accountId: this.purchaseDiscountAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
      indexGroup: 40,
    };
  }

  /**
   * Retrieves the purchase other charges GL entry.
   * @returns {ILedgerEntry}
   */
  private get adjustmentEntry(): ILedgerEntry {
    const commonEntry = this.billCommonEntry;
    const adjustmentAmount = Math.abs(this.bill.adjustmentLocal);

    return {
      ...commonEntry,
      debit: this.bill.adjustmentLocal > 0 ? adjustmentAmount : 0,
      credit: this.bill.adjustmentLocal < 0 ? adjustmentAmount : 0,
      accountId: this.otherExpensesAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
      indexGroup: 40,
    };
  }

  /**
   * Retrieves the given bill GL entries.
   * @returns {ILedgerEntry[]}
   */
  private getBillGLEntries = (): ILedgerEntry[] => {
    const payableEntry = this.billPayableEntry;

    const itemsEntries = this.bill.entries.map((entry, index) =>
      this.getBillItemEntry(entry, index),
    );
    const landedCostEntries = this.bill.locatedLandedCosts.map(
      (landedCost, index) => this.getBillLandedCostEntry(landedCost, index),
    );

    // Allocate cost entries journal entries.
    return [
      payableEntry,
      ...itemsEntries,
      ...landedCostEntries,
      this.purchaseDiscountEntry,
      this.adjustmentEntry,
    ];
  };

  /**
   * Retrieves the given bill ledger.
   * @returns {Ledger}
   */
  public getBillLedger = () => {
    const entries = this.getBillGLEntries();

    return new Ledger(entries);
  };
}
