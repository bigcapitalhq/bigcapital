import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import { defaultTableQuery } from './vendor-credit.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const vendorCreditsTableStateSelector = (state: RootState) => {
  return state.vendorCredit.tableState;
};

/**
 * Retrieve vendor credit table state.
 */
export const getVendorCreditTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    vendorCreditsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

/**
 * Retrieve vendor credit table state.
 */
export const isVendorCreditTableStateChangedFactory = () =>
  createDeepEqualSelector(vendorCreditsTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

export const getVendorsCreditNoteSelectedRowsFactory = () =>
  createSelector(
    (state: RootState) => state.vendorCredit.selectedRows,
    (selectedRows) => selectedRows,
  );
