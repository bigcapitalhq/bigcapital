import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';

const itemsTableQuerySelector = (state) => state.items.tableQuery;

// Get items table query marged with location query.
export const getItemsTableQueryFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    itemsTableQuerySelector,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );
