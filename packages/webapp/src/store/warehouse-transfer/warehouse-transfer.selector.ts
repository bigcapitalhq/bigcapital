import { isEqual } from 'lodash';
import { defaultTableQuery } from './warehouse-transfer.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const warehouseTransfersTableStateSelector = (state: RootState) =>
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
