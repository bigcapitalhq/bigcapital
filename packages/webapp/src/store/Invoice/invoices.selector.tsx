// @ts-nocheck
import { isEqual } from 'lodash';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import { defaultTableQuery } from './invoices.reducer';
import { createSelector } from 'reselect';

const invoicesTableStateSelector = (state) => state.salesInvoices.tableState;

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
    (state) => state.salesInvoices.selectedRows,
    (selectedRows) => selectedRows,
  );
