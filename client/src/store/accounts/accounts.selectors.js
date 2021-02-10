import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';

// Accounts table state selector
const accountsTableStateSelector = (state, props) => state.accounts.tableState;

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
