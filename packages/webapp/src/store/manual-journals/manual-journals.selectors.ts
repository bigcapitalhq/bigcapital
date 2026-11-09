import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import { defaultTableQuery } from './manual-journals.reducers';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const manualJournalsTableState = (state: RootState) =>
  state.manualJournals.tableState;

// Retrieve manual jouranls table state.
export const getManualJournalsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    manualJournalsTableState,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );

export const manualJournalTableStateChangedFactory = () =>
  createDeepEqualSelector(manualJournalsTableState, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

export const getManualJournalsSelectedRowsFactory = () =>
  createSelector(
    (state: RootState) => state.manualJournals.selectedRows,
    (selectedRows) => selectedRows,
  );
