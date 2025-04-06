// @ts-nocheck
import { chain } from 'lodash';
import { pick } from 'lodash';
import { IItemEntryTransactionType } from '../TransactionItemEntry/ItemEntry.types';
import { TInventoryTransactionDirection } from './types/InventoryCost.types';

/**
 * Grpups by transaction type and id the inventory transactions.
 * @param {IInventoryTransaction} invTransactions
 * @returns
 */
export function groupInventoryTransactionsByTypeId(
  transactions: { transactionType: string; transactionId: number }[],
): { transactionType: string; transactionId: number }[][] {
  return chain(transactions)
    .groupBy((t) => `${t.transactionType}-${t.transactionId}`)
    .values()
    .value();
}

/**
 * Transforms the items entries to inventory transactions.
 */
export function transformItemEntriesToInventory(transaction: {
  transactionId: number;
  transactionType: IItemEntryTransactionType;
  transactionNumber?: string;

  exchangeRate?: number;

  warehouseId: number | null;

  date: Date | string;
  direction: TInventoryTransactionDirection;
  entries: IItemEntry[];
  createdAt: Date;
}): IInventoryTransaction[] {
  const exchangeRate = transaction.exchangeRate || 1;

  return transaction.entries.map((entry: IItemEntry) => ({
    ...pick(entry, ['itemId', 'quantity']),
    rate: entry.rate * exchangeRate,
    transactionType: transaction.transactionType,
    transactionId: transaction.transactionId,
    direction: transaction.direction,
    date: transaction.date,
    entryId: entry.id,
    createdAt: transaction.createdAt,
    costAccountId: entry.costAccountId,

    warehouseId: entry.warehouseId || transaction.warehouseId,
    meta: {
      transactionNumber: transaction.transactionNumber,
      description: entry.description,
    },
  }));
}
