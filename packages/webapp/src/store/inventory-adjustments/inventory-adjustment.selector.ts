import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';

const inventoryAdjustmentTableState = (state: RootState) =>
  state.inventoryAdjustments.tableState;

/**
 * Retrieve the inventory adjustments table state.
 */
export const getInventroyAdjsTableStateFactory = () =>
  createSelector(
    paginationLocationQuery,
    inventoryAdjustmentTableState,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );
