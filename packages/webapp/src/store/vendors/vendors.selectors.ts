import { isEqual } from 'lodash';
import { defaultTableQueryState } from './vendors.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const vendorsTableStateSelector = (state: RootState) =>
  state.vendors.tableState;

/**
 * Retrieve vendors table state.
 */
export const getVendorsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    vendorsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const vendorsTableStateChangedFactory = () =>
  createDeepEqualSelector(vendorsTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQueryState);
  });
