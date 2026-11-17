import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import { defaultTableQuery } from './recurring-journals.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const recurringJournalsTableStateSelector = (state: RootState) =>
  state.recurringJournals.tableState;

export const getRecurringJournalsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    recurringJournalsTableStateSelector,
    (locationQuery, tableState) => ({
      ...locationQuery,
      ...tableState,
    }),
  );

export const isRecurringJournalsTableStateChangedFactory = () =>
  createDeepEqualSelector(recurringJournalsTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

export const getRecurringJournalsSelectedRowsFactory = () =>
  createSelector(
    (state: RootState) => state.recurringJournals.selectedRows,
    (selectedRows) => selectedRows,
  );
