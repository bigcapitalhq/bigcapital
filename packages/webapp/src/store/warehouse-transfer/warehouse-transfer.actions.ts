import type { TableQuery } from '@/store/store.types';
import {
  WAREHOUSE_TRANSFERS_TABLE_STATE_RESET,
  WAREHOUSE_TRANSFERS_TABLE_STATE_SET,
  WAREHOUSE_TRANSFERS_SET_SELECTED_ROWS,
  WAREHOUSE_TRANSFERS_RESET_SELECTED_ROWS,
} from '@/store/warehouse-transfer/warehouse-transfer.type';

export const setWarehouseTransferTableState = (
  queries: Partial<TableQuery>,
) => {
  return {
    type: WAREHOUSE_TRANSFERS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetWarehouseTransferTableState = () => {
  return {
    type: WAREHOUSE_TRANSFERS_TABLE_STATE_RESET,
  };
};

export const setWarehouseTransferSelectedRows = (
  selectedRows: Array<unknown>,
) => {
  return {
    type: WAREHOUSE_TRANSFERS_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};

export const resetWarehouseTransferSelectedRows = () => {
  return {
    type: WAREHOUSE_TRANSFERS_RESET_SELECTED_ROWS,
  };
};
