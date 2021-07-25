/**
 * Retrieve transaction entries of the given transaction id.
 */
export function getEntriesByTransactionId(transactions, id) {
  const transaction = transactions.find((trans) => trans.id === id);
  return transaction ? transaction.entries : [];
}
