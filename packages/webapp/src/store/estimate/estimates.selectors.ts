import { isEqual } from 'lodash';
import { createDeepEqualSelector } from '@/utils';
import { paginationLocationQuery } from '@/store/selectors';
import { defaultTableQuery } from './estimates.reducer';
import { createSelector } from 'reselect';
import type { RootState } from '@/store/reducers';

const estimatesTableState = (state: RootState) => state.salesEstimates.tableState;

// Retrieve estimates table query.
export const getEstimatesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    estimatesTableState,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const isEstimatesTableStateChangedFactory = () =>
  createDeepEqualSelector(estimatesTableState, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

export const getEstimatesSelectedRowsFactory = () => createSelector(
  (state: RootState) => state.salesEstimates.selectedRows,
  (selectedRows) => selectedRows,
);