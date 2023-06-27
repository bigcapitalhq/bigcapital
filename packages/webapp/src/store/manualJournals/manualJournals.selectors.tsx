// @ts-nocheck
import { isEqual } from 'lodash';

import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import { defaultTableQuery } from './manualJournals.reducers';

const manualJournalsTableState = (state) => state.manualJournals.tableState;

// Retrieve manual journals table state.
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
