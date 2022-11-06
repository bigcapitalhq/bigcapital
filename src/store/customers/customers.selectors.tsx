// @ts-nocheck
import { isEqual } from 'lodash';

import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import { defaultTableQueryState } from './customers.reducer';

const customerTableStateSelector = (state) => state.customers.tableState;

export const getCustomersTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    customerTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const customersTableStateChangedFactory = () =>
  createDeepEqualSelector(customerTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQueryState);
  });
  