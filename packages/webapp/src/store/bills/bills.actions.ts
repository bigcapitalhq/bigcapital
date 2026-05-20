import { BILLS_TABLE_STATE_RESET, BILLS_TABLE_STATE_SET, BILLS_SET_SELECTED_ROWS } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

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
