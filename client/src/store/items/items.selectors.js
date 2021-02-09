import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';

const itemsTableStateSelector = (state) => state.items.tableState;

// Get items table state marged with location query.
export const getItemsTableStateFactory = () =>
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
