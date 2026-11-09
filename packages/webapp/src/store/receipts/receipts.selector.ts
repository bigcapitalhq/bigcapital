import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import { defaultTableQuery } from './receipts.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const receiptTableStateSelector = (state: RootState) =>
  state.salesReceipts.tableState;

// Retrieve receipts table query.
export const getReceiptsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    receiptTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const receiptsTableStateChangedFactory = () =>
  createDeepEqualSelector(receiptTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

export const getReceiptsSelectedRowsFactory = () =>
  createSelector(
    (state: RootState) => state.salesReceipts.selectedRows,
    (selectedRows) => selectedRows,
  );
