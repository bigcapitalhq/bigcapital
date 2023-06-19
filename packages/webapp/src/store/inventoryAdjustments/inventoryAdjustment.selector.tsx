// @ts-nocheck
import { createSelector } from '@reduxjs/toolkit';
import {
  paginationLocationQuery,
} from '@/store/selectors';

const inventoryAdjustmentTableState = (state) =>
  state.inventoryAdjustments.tableState;

/**
 * Retrieve the inventory adjustments table state.
 */
export const getInventoryAdjsTableStateFactory = () =>
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
