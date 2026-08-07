// Query key constants
import { ITEMS_CATEGORIES, ITEM_CATEGORY } from '../items/query-keys';
export { ITEMS_CATEGORIES, ITEM_CATEGORY } from '../items/query-keys';

// Query key factory
export const itemsCategoriesKeys = {
  all: () => [ITEMS_CATEGORIES] as const,
  detail: (id: number | null | undefined) => [ITEM_CATEGORY, id] as const,
};

// Grouped object for use in components/hooks
export const ItemsCategoriesQueryKeys = {
  ITEMS_CATEGORIES,
  ITEM_CATEGORY,
} as const;
