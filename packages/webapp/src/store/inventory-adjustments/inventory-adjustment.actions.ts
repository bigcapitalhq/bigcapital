import type { TableQuery } from '@/store/store.types';
import { INVENTORY_ADJUSTMENTS_TABLE_STATE_SET } from '@/store/types';

/**
 * Sets the inventory adjustments table state.
 */
export const setInventoryAdjustmentsTableState = (
  queries: Partial<TableQuery>,
) => {
  return {
    type: INVENTORY_ADJUSTMENTS_TABLE_STATE_SET,
    payload: { queries },
  };
};
