import type { TableQuery } from '@/store/store.types';
import {
  VENDORS_TABLE_STATE_RESET,
  VENDORS_TABLE_STATE_SET,
  VENDORS_SET_SELECTED_ROWS,
  VENDORS_RESET_SELECTED_ROWS,
} from '@/store/types';

export const setVendorsTableState = (queries: Partial<TableQuery>) => {
  return {
    type: VENDORS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetVendorsTableState = () => {
  return {
    type: VENDORS_TABLE_STATE_RESET,
  };
};

export const setVendorsSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: VENDORS_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};

export const resetVendorsSelectedRows = () => {
  return {
    type: VENDORS_RESET_SELECTED_ROWS,
  };
};
