import { isEqual } from 'lodash';
import { defaultTableQuery } from './budgets.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const budgetsTableStateSelector = (state: RootState) =>
  state.budgets.tableState;

/**
 * Retrieve budgets table state.
 */
export const getBudgetsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    budgetsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

/**
 * Determines whether the budgets table state changed.
 */
export const isBudgetsTableStateChangedFactory = () =>
  createDeepEqualSelector(budgetsTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
