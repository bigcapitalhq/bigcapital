// @ts-nocheck
import { isEqual } from 'lodash';
import { createDeepEqualSelector } from '@/utils';
import { paginationLocationQuery } from '@/store/selectors';
import { defaultTableQuery } from './estimates.reducer';

const estimatesTableState = (state) => state.salesEstimates.tableState;

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
