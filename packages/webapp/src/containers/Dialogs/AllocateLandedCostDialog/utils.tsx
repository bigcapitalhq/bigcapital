import { sumBy, round } from 'lodash';
import * as R from 'ramda';
import React from 'react';
import intl from 'react-intl-universal';
import type {
  AllocateLandedCostFormEntry,
  AllocateLandedCostItem,
  LandedCostTransaction,
} from './types';
import { MoneyFieldCell } from '@/components';
import { defaultFastFieldShouldUpdate } from '@/utils';

export const defaultInitialItem: AllocateLandedCostItem = {
  entryId: '',
  cost: '',
};

// Default form initial values.
export const defaultInitialValues = {
  transactionType: 'Bill',
  transactionId: '',
  transactionEntryId: '',
  amount: '',
  allocationMethod: 'quantity',
  items: [defaultInitialItem],
};

/**
 * Retrieve transaction entries of the given transaction id.
 */
export function getEntriesByTransactionId(
  transactions:
    | { id: number; entries?: AllocateLandedCostFormEntry[] }[]
    | undefined,
  id: number | null,
): AllocateLandedCostFormEntry[] {
  const transaction = transactions?.find((trans) => trans.id === id);
  return transaction ? (transaction.entries ?? []) : [];
}

/**
 *
 * @param {*} transaction
 * @param {*} transactionEntryId
 * @returns
 */
export function getTransactionEntryById(
  transaction: { entries?: AllocateLandedCostFormEntry[] } | null | undefined,
  transactionEntryId: number | null,
): AllocateLandedCostFormEntry | undefined {
  return transaction?.entries?.find((entry) => entry.id === transactionEntryId);
}

/**
 *
 * @param {*} total
 * @param {*} allocateType
 * @param {*} entries
 * @returns
 */
export function allocateCostToEntries(
  total: number | string,
  allocateType: string,
  entries: AllocateLandedCostFormEntry[],
): AllocateLandedCostFormEntry[] {
  return R.compose(
    R.when(
      R.always(allocateType === 'value'),
      R.curry(allocateCostByValue)(total),
    ),
    R.when(
      R.always(allocateType === 'quantity'),
      R.curry(allocateCostByQuantity)(total),
    ),
  )(entries) as AllocateLandedCostFormEntry[];
}

/**
 * Allocate total cost on entries on value.
 * @param {*} entries
 * @param {*} total
 * @returns
 */
export function allocateCostByValue(
  total: number | string,
  entries: AllocateLandedCostFormEntry[],
): AllocateLandedCostFormEntry[] {
  const totalAmount = sumBy(entries, (e) => Number(e.amount ?? 0));

  const entriesMapped = entries.map((entry) => ({
    ...entry,
    percentageOfValue: Number(entry.amount ?? 0) / totalAmount,
  }));

  return entriesMapped.map((entry) => ({
    ...entry,
    cost: round(entry.percentageOfValue * Number(total), 2),
  }));
}

/**
 * Allocate total cost on entries by quantity.
 * @param {*} entries
 * @param {*} total
 * @returns
 */
export function allocateCostByQuantity(
  total: number | string,
  entries: AllocateLandedCostFormEntry[],
): AllocateLandedCostFormEntry[] {
  const totalQuantity = sumBy(entries, (e) => Number(e.quantity ?? 0));

  const _entries = entries.map((entry) => ({
    ...entry,
    percentageOfQuantity: Number(entry.quantity ?? 0) / totalQuantity,
  }));

  return _entries.map((entry) => ({
    ...entry,
    cost: round(entry.percentageOfQuantity * Number(total), 2),
  }));
}

/**
 * Retrieve the landed cost transaction by the given id.
 */
export function getCostTransactionById(
  id: number | null,
  transactions:
    | { id: number; entries?: AllocateLandedCostFormEntry[] }[]
    | undefined,
): LandedCostTransaction | undefined {
  return transactions?.find((trans) => trans.id === id) as
    | LandedCostTransaction
    | undefined;
}

/**
 * Detarmines the transactions selet field when should update.
 */
export function transactionsSelectShouldUpdate(
  newProps: { transactions?: unknown } & Record<string, unknown>,
  oldProps: { transactions?: unknown } & Record<string, unknown>,
): boolean {
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
export function resetAllocatedCostEntries(
  entries: AllocateLandedCostFormEntry[],
): AllocateLandedCostFormEntry[] {
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
