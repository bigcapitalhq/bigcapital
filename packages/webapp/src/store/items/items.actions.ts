import type { TableQuery } from '@/store/store.types';
import {
  ITEMS_TABLE_STATE_RESET,
  ITEMS_TABLE_STATE_SET,
  ITEMS_SET_SELECTED_ROWS,
} from '@/store/types';

export const setItemsTableState = (queries: Partial<TableQuery>) => {
  return {
    type: ITEMS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetItemsTableState = () => {
  return {
    type: ITEMS_TABLE_STATE_RESET,
  };
};

export const setItemsSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: ITEMS_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};
