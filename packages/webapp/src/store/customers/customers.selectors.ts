import { isEqual } from 'lodash';
import { defaultTableQueryState } from './customers.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const customerTableStateSelector = (state: RootState) =>
  state.customers.tableState;

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
