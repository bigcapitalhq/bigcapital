import { chain } from 'lodash';
import { flatMap, pick } from 'lodash';
import { IItemEntryTransactionType } from '../TransactionItemEntry/ItemEntry.types';
import {
  TInventoryTransactionDirection,
  IInventoryTransaction,
  IInventoryTransactionItemEntry,
} from './types/InventoryCost.types';

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

  warehouseId?: number | null;

  date: Date | string;
  direction: TInventoryTransactionDirection;
  entries: IInventoryTransactionItemEntry[];
  createdAt: Date;
}): IInventoryTransaction[] {
  const exchangeRate = transaction.exchangeRate || 1;

  return flatMap(
    transaction.entries,
    (entry: IInventoryTransactionItemEntry) => {
      const allocations =
        entry.batches?.length > 0
          ? entry.batches
          : [
              {
                batchId: entry.batchId ?? null,
                quantity: entry.quantity,
              },
            ];

      return allocations.map((allocation) => ({
        ...pick(entry, ['itemId']),
        quantity: allocation.quantity,
        rate: entry.rate * exchangeRate,
        transactionType: transaction.transactionType,
        transactionId: transaction.transactionId,
        direction: transaction.direction,
        date: transaction.date,
        entryId: entry.id,
        createdAt: transaction.createdAt,
        costAccountId: entry.costAccountId,

        warehouseId: entry.warehouseId || transaction.warehouseId,
        batchId: allocation.batchId ?? entry.batchId,
        meta: {
          transactionNumber: transaction.transactionNumber,
          description: entry.description,
        },
      }));
    },
  );
}
