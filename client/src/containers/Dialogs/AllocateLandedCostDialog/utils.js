import { sumBy, round } from 'lodash';
import * as R from 'ramda';
/**
 * Retrieve transaction entries of the given transaction id.
 */
export function getEntriesByTransactionId(transactions, id) {
  const transaction = transactions.find((trans) => trans.id === id);
  return transaction ? transaction.entries : [];
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
