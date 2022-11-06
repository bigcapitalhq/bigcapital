// @ts-nocheck
import { isEqual } from 'lodash';

import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import { defaultTableQuery } from './bills.reducer';

const billsTableStateSelector = (state) => state.bills.tableState;

// Get bills table state marged with location query.
export const getBillsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    billsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const billsTableStateChangedFactory = () =>
  createDeepEqualSelector(billsTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
