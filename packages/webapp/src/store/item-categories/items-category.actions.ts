import { ITEMS_CATEGORIES_TABLE_STATE_SET } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

/**
 * Sets the items categories table state.
 */
export const setItemsCategoriesTableState = (queries: Partial<TableQuery>) => {
  return {
    type: ITEMS_CATEGORIES_TABLE_STATE_SET,
    payload: { queries },
  };
};
