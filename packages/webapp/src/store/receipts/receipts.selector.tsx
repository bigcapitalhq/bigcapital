// @ts-nocheck
import { isEqual } from 'lodash';

import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import { defaultTableQuery } from './receipts.reducer';
import { createSelector } from 'reselect';

const receiptTableStateSelector = (state) => state.salesReceipts.tableState;

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
    (state) => state.salesReceipts.selectedRows,
    (selectedRows) => selectedRows,
  );