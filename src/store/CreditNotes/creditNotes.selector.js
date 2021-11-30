import { isEqual } from 'lodash';
import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';
import { defaultTableQuery } from './creditNotes.reducer';

const creditNotesTableStateSelector = (state) => state.creditNotes.tableState;

/**
 * Retrieve credit note table state.
 */
export const getCreditNoteTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    creditNotesTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

/**
 * Retrieve Credit note table state.
 */
export const isCreditNoteTableStateChangedFactory = () =>
  createDeepEqualSelector(creditNotesTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
