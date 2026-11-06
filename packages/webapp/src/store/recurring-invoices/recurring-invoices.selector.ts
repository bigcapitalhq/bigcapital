import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import { defaultTableQuery } from './recurring-invoices.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const recurringInvoicesTableStateSelector = (state: RootState) =>
  state.recurringInvoices.tableState;

export const getRecurringInvoicesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    recurringInvoicesTableStateSelector,
    (locationQuery, tableState) => ({
      ...locationQuery,
      ...tableState,
    }),
  );

export const isRecurringInvoicesTableStateChangedFactory = () =>
  createDeepEqualSelector(recurringInvoicesTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

export const getRecurringInvoicesSelectedRowsFactory = () =>
  createSelector(
    (state: RootState) => state.recurringInvoices.selectedRows,
    (selectedRows) => selectedRows,
  );
