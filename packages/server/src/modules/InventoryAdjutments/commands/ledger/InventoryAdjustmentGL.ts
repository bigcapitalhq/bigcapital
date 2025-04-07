import * as R from 'ramda';
import { InventoryAdjustment } from '../../models/InventoryAdjustment';
import { InventoryAdjustmentEntry } from '../../models/InventoryAdjustmentEntry';
import { ILedgerEntry } from '../../../Ledger/types/Ledger.types';
import { AccountNormal } from '@/interfaces/Account';
import { Ledger } from '../../../Ledger/Ledger';

export class InventoryAdjustmentsGL {
  private inventoryAdjustment: InventoryAdjustment;
  private baseCurrency: string;

  constructor(inventoryAdjustmentModel: InventoryAdjustment) {
    this.inventoryAdjustment = inventoryAdjustmentModel;
  }

  /**
   * Sets the base currency.
   * @param {string} baseCurrency - Base currency.
   * @returns {InventoryAdjustmentsGL}
   */
  public setBaseCurrency(baseCurrency: string) {
    this.baseCurrency = baseCurrency;
    return this;
  }

  /**
   * Retrieves the inventory adjustment common GL entry.
   * @returns {ILedgerEntry}
   */
  private get adjustmentGLCommonEntry() {
    return {
      currencyCode: this.baseCurrency,
      exchangeRate: 1,

      transactionId: this.inventoryAdjustment.id,
      transactionType: 'InventoryAdjustment',
      referenceNumber: this.inventoryAdjustment.referenceNo,

      date: this.inventoryAdjustment.date,

      userId: this.inventoryAdjustment.userId,
      branchId: this.inventoryAdjustment.branchId,

      createdAt: this.inventoryAdjustment.createdAt,

      credit: 0,
      debit: 0,
    };
  }

  /**
   * Retrieve the inventory adjustment inventory GL entry.
   * @param {InventoryAdjustmentEntry} entry - Inventory adjustment entry.
   * @param {number} index - Entry index.
   * @returns {ILedgerEntry}
   */
  private getAdjustmentGLInventoryEntry = R.curry(
    (entry: InventoryAdjustmentEntry, index: number): ILedgerEntry => {
      const commonEntry = this.adjustmentGLCommonEntry;
      const amount = entry.cost * entry.quantity;

      return {
        ...commonEntry,
        debit: amount,
        accountId: entry.item.inventoryAccountId,
        accountNormal: AccountNormal.DEBIT,
        index,
      };
    },
  );

  /**
   * Retrieves the inventory adjustment
   * @param   {IInventoryAdjustment} inventoryAdjustment
   * @param   {IInventoryAdjustmentEntry} entry
   * @returns {ILedgerEntry}
   */
  private getAdjustmentGLCostEntry(
    entry: InventoryAdjustmentEntry,
    index: number,
  ): ILedgerEntry {
    const commonEntry = this.adjustmentGLCommonEntry;
    const amount = entry.cost * entry.quantity;

    return {
      ...commonEntry,
      accountId: this.inventoryAdjustment.adjustmentAccountId,
      accountNormal: AccountNormal.DEBIT,
      credit: amount,
      index: index + 2,
    };
  }

  /**
   * Retrieve the inventory adjustment GL item entry.
   * @param {InventoryAdjustmentEntry} entry - Inventory adjustment entry.
   * @param {number} index - Entry index.
   * @returns {ILedgerEntry[]}
   */
  private getAdjustmentGLItemEntry(
    entry: InventoryAdjustmentEntry,
    index: number,
  ): ILedgerEntry[] {
    const getInventoryEntry = this.getAdjustmentGLInventoryEntry();
    const inventoryEntry = getInventoryEntry(entry, index);
    const costEntry = this.getAdjustmentGLCostEntry(entry, index);

    return [inventoryEntry, costEntry];
  }

  /**
   * Writes increment inventroy adjustment GL entries.
   * @param   {InventoryAdjustment} inventoryAdjustment -
   * @param   {JournalPoster} jorunal -
   * @returns {ILedgerEntry[]}
   */
  public getIncrementAdjustmentGLEntries(): ILedgerEntry[] {
    return this.inventoryAdjustment.entries
      .map((entry, index) => this.getAdjustmentGLItemEntry(entry, index))
      .flat();
  }

  public getAdjustmentGL(): Ledger {
    const entries = this.getIncrementAdjustmentGLEntries();

    return new Ledger(entries);
  }
}
