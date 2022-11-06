// @ts-nocheck
import { isEqual } from 'lodash';

import { createDeepEqualSelector } from '@/utils';
import { paginationLocationQuery } from '@/store/selectors';
import { defaultTableQueryState } from './vendors.reducer';

const vendorsTableStateSelector = (state) => state.vendors.tableState;

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
