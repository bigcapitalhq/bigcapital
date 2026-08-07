import { isEqual } from 'lodash';
import { defaultTableQuery } from './accounts.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

// Accounts table state selector
const accountsTableStateSelector = (state: RootState) =>
  state.accounts.tableState;

// Get accounts table state marged with location query.
export const getAccountsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    accountsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const accountsTableStateChangedFactory = () =>
  createDeepEqualSelector(accountsTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
