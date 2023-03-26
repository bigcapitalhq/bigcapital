import { chain } from 'lodash';

/**
 * Grpups by transaction type and id the inventory transactions.
 * @param {IInventoryTransaction} invTransactions
 * @returns
 */
export function groupInventoryTransactionsByTypeId(
  transactions: { transactionType: string; transactionId: number }[]
): { transactionType: string; transactionId: number }[][] {
  return chain(transactions)
    .groupBy((t) => `${t.transactionType}-${t.transactionId}`)
    .values()
    .value();
}
