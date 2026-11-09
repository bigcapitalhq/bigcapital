import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import { defaultTableQuery } from './invoices.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const invoicesTableStateSelector = (state: RootState) =>
  state.salesInvoices.tableState;

/**
 * Retrieve invoices table state.
 */
export const getInvoicesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    invoicesTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

/**
 * Retrieve invoices table state.
 */
export const isInvoicesTableStateChangedFactory = () =>
  createDeepEqualSelector(invoicesTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

/**
 * Retrieve invoices selected rows.
 */
export const getInvoicesSelectedRowsFactory = () =>
  createSelector(
    (state: RootState) => state.salesInvoices.selectedRows,
    (selectedRows) => selectedRows,
  );
