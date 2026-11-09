import { isEqual } from 'lodash';
import { defaultTableQuery } from './credit-note.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const creditsTableStateSelector = (state: RootState) =>
  state.creditNotes.tableState;

/**
 * Retrieve credit notes table state.
 */
export const getCreditNotesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    creditsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

/**
 * Retrieve credit notes table state.
 */
export const isCreditNotesTableStateChangedFactory = () =>
  createDeepEqualSelector(creditsTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
