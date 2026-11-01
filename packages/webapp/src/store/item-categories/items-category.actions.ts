import type { TableQuery } from '@/store/store.types';
import {
  ITEMS_CATEGORIES_TABLE_STATE_SET,
  ITEMS_CATEGORIES_SET_SELECTED_ROWS,
  ITEMS_CATEGORIES_RESET_SELECTED_ROWS,
} from '@/store/types';

/**
 * Sets the items categories table state.
 */
export const setItemsCategoriesTableState = (queries: Partial<TableQuery>) => {
  return {
    type: ITEMS_CATEGORIES_TABLE_STATE_SET,
    payload: { queries },
  };
};

/**
 * Sets the items categories selected rows.
 */
export const setItemsCategoriesSelectedRows = (
  selectedRows: Array<unknown>,
) => {
  return {
    type: ITEMS_CATEGORIES_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};

/**
 * Resets the items categories selected rows.
 */
export const resetItemsCategoriesSelectedRows = () => {
  return {
    type: ITEMS_CATEGORIES_RESET_SELECTED_ROWS,
  };
};
