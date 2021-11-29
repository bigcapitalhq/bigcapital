import { isEqual } from 'lodash';
import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';
import { defaultTableQuery } from './vendorsCreditNotes.reducer';

const VendorsCreditNoteTableStateSelector = (state) =>
  state.vendorsCreditNotes.tableState;

export const getVendorsCreditNoteTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    VendorsCreditNoteTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const isVendorsCreditNoteTableStateChangedFactory = () =>
  createDeepEqualSelector(VendorsCreditNoteTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
