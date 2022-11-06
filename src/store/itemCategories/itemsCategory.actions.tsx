// @ts-nocheck
import t from '@/store/types';

/**
 * Sets the items categories table state.
 */
export const setItemsCategoriesTableState = (queries) => {
  return {
    type: t.ITEMS_CATEGORIES_TABLE_STATE_SET,
    payload: { queries },
  };
};
