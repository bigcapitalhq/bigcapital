import type { TableQuery } from '@/store/store.types';
import {
  RECEIPTS_SELECTED_ROWS_SET,
  RECEIPTS_TABLE_STATE_RESET,
  RECEIPTS_TABLE_STATE_SET,
  RECEIPTS_RESET_SELECTED_ROWS,
} from '@/store/types';

export const setReceiptsTableState = (queries: Partial<TableQuery>) => {
  return {
    type: RECEIPTS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetReceiptsTableState = () => {
  return {
    type: RECEIPTS_TABLE_STATE_RESET,
  };
};

export const setReceiptsSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: RECEIPTS_SELECTED_ROWS_SET,
    payload: selectedRows,
  };
};

export const resetReceiptsSelectedRows = () => {
  return {
    type: RECEIPTS_RESET_SELECTED_ROWS,
  };
};
