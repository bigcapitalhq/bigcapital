// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { sumBy, round } from 'lodash';
import * as R from 'ramda';

import { defaultFastFieldShouldUpdate } from '@/utils';
import { MoneyFieldCell } from '@/components';

export const defaultInitialItem = {
  entry_id: '',
  cost: '',
};

// Default form initial values.
export const defaultInitialValues = {
  transaction_type: 'Bill',
  transaction_id: '',
  transaction_entry_id: '',
  amount: '',
  allocation_method: 'quantity',
  items: [defaultInitialItem],
};

/**
 * Retrieve transaction entries of the given transaction id.
 */
export function getEntriesByTransactionId(transactions, id) {
  const transaction = transactions.find((trans) => trans.id === id);
  return transaction ? transaction.entries : [];
}

/**
 *
 * @param {*} transaction
 * @param {*} transactionEntryId
 * @returns
 */
export function getTransactionEntryById(transaction, transactionEntryId) {
  return transaction.entries.find((entry) => entry.id === transactionEntryId);
}

/**
 *
 * @param {*} total
 * @param {*} allocateType
 * @param {*} entries
 * @returns
 */
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

  const entriesMapped = entries.map((entry) => ({
    ...entry,
    percentageOfValue: entry.amount / totalAmount,
  }));

  return entriesMapped.map((entry) => ({
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
 * Retrieve the landed cost transaction by the given id.
 */
export function getCostTransactionById(id, transactions) {
  return transactions.find((trans) => trans.id === id);
}

/**
 * Determines the transactions selet field when should update.
 */
export function transactionsSelectShouldUpdate(newProps, oldProps) {
  return (
    newProps.transactions !== oldProps.transactions ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
}

/**
 *
 * @param {*} entries
 * @returns
 */
export function resetAllocatedCostEntries(entries) {
  return entries.map((entry) => ({ ...entry, cost: 0 }));
}

/**
 * Retrieves allocate landed cost entries table columns.
 */
export const useAllocateLandedCostEntriesTableColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: intl.get('item'),
        accessor: 'item.name',
        disableSortBy: true,
        width: '150',
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        disableSortBy: true,
        width: '100',
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        disableSortBy: true,
        width: '100',
        align: 'right',
      },
      {
        Header: intl.get('amount'),
        accessor: 'amount',
        disableSortBy: true,
        align: 'right',
        width: '100',
      },
      {
        Header: intl.get('cost'),
        accessor: 'cost',
        width: '150',
        Cell: MoneyFieldCell,
        disableSortBy: true,
      },
    ],
    [],
  );
};
