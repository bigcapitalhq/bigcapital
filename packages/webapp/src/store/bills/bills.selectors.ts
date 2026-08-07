import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import { defaultTableQuery } from './bills.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const billsTableStateSelector = (state: RootState) => state.bills.tableState;

// Get bills table state marged with location query.
export const getBillsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    billsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const billsTableStateChangedFactory = () =>
  createDeepEqualSelector(billsTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

export const getBillsSelectedRowsFactory = () =>
  createSelector(
    (state: RootState) => state.bills.selectedRows,
    (selectedRows) => selectedRows,
  );
