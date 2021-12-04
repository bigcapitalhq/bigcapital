import { sumBy, round } from 'lodash';
import * as R from 'ramda';
import { defaultFastFieldShouldUpdate } from 'utils';

/**
 * Retrieve the landed cost transaction by the given id.
 */
export function getCostTransactionById(id, transactions) {
  return transactions.find((trans) => trans.id === id);
}

/**
 * Retrieve transaction entries of the given transaction id.
 */
export function getEntriesByTransactionId(transactions, id) {
  const transaction = transactions.find((trans) => trans.id === id);
  return transaction ? transaction.entries : [];
}

export function getTransactionEntryById(transaction, transactionEntryId) {
  return transaction.entries.find((entry) => entry.id === transactionEntryId);
}

export function allocateCostToEntries(total, allocateType, entries) {
  return R.compose(
    R.when(
      R.always(allocateType === 'value'),
      R.curry(allocateCostByValue)(total),
    ),
    R.when(
      R.always(allocateType === 'quantity'),
      R.curry(allocateCostByQuantity)(total),
    ),
  )(entries);
}

/**
 * Allocate total cost on entries on value.
 * @param {*} entries
 * @param {*} total
 * @returns
 */
export function allocateCostByValue(total, entries) {
  const totalAmount = sumBy(entries, 'amount');

  const _entries = entries.map((entry) => ({
    ...entry,
    percentageOfValue: entry.amount / totalAmount,
  }));

  return _entries.map((entry) => ({
    ...entry,
    cost: round(entry.percentageOfValue * total, 2),
  }));
}

/**
 * Allocate total cost on entries by quantity.
 * @param {*} entries
 * @param {*} total
 * @returns
 */
export function allocateCostByQuantity(total, entries) {
  const totalQuantity = sumBy(entries, 'quantity');

  const _entries = entries.map((entry) => ({
    ...entry,
    percentageOfQuantity: entry.quantity / totalQuantity,
  }));

  return _entries.map((entry) => ({
    ...entry,
    cost: round(entry.percentageOfQuantity * total, 2),
  }));
}

/**
 * Detarmines the transactions selet field when should update.
 */
export function transactionsSelectShouldUpdate(newProps, oldProps) {
  return (
    newProps.transactions !== oldProps.transactions ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
}


export function resetAllocatedCostEntries(entries) {
  return entries.map((entry) => ({ ...entry, cost: 0 }));
}