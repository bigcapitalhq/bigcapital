import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';

const manualJournalsTableState = (state) => state.manualJournals.tableState;

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
