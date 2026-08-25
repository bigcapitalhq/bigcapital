import type { TableQuery } from '@/store/store.types';
import {
  BILLS_TABLE_STATE_RESET,
  BILLS_TABLE_STATE_SET,
  BILLS_SET_SELECTED_ROWS,
  BILLS_RESET_SELECTED_ROWS,
} from '@/store/types';

export const setBillsTableState = (queries: Partial<TableQuery>) => {
  return {
    type: BILLS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetBillsTableState = () => {
  return {
    type: BILLS_TABLE_STATE_RESET,
  };
};

export const setBillsSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: BILLS_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};

export const resetBillsSelectedRows = () => {
  return {
    type: BILLS_RESET_SELECTED_ROWS,
  };
};
