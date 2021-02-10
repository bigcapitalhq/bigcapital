import { createDeepEqualSelector } from 'utils';
import { paginationLocationQuery } from 'store/selectors';

// Items table state selectors.
const itemsTableStateSelector = (state) => state.expenses.tableState;

// Retrive expenses table query.
export const getExpensesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    itemsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
