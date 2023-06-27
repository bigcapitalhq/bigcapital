// @ts-nocheck
import { isEqual } from 'lodash';

import { createDeepEqualSelector } from '@/utils';
import { paginationLocationQuery } from '@/store/selectors';
import { defaultTableQuery } from './expenses.reducer';

// Items table state selectors.
const expensesTableStateSelector = (state) => state.expenses.tableState;

// Retrieve expenses table query.
export const getExpensesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    expensesTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const expensesTableStateChangedFactory = () =>
  createDeepEqualSelector(expensesTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
