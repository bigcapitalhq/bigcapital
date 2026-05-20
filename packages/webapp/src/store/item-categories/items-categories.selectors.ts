import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import type { RootState } from '@/store/reducers';

// Items categories table state.
const itemsCategoriesTableStateSelector = (state: RootState) =>
  state.itemsCategories.tableState;

// Get items categories table state marged with location query.
export const getItemsCategoriesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    itemsCategoriesTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
