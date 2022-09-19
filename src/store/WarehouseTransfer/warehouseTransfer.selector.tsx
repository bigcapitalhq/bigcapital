// @ts-nocheck
import { isEqual } from 'lodash';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import { defaultTableQuery } from './warehouseTransfer.reducer';

const warehouseTransfersTableStateSelector = (state) =>
  state.warehouseTransfers.tableState;

/**
 * Retrieve warehouse transfers table state.
 */
export const getWarehouseTransfersTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    warehouseTransfersTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

/**
 * Retrieve warehouse transfers table state.
 */
export const isWarehouseTransferTableStateChangedFactory = () =>
  createDeepEqualSelector(
    warehouseTransfersTableStateSelector,
    (tableState) => {
      return !isEqual(tableState, defaultTableQuery);
    },
  );
