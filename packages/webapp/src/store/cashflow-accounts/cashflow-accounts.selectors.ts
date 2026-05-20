import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import type { RootState } from '@/store/reducers';

// Accounts table state selector
const cashflowAccountsTableStateSelector = (state: RootState) =>
  state.cashflowAccounts.tableState;

// Get accounts table state marged with location query.
export const getCashflowAccountsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    cashflowAccountsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
