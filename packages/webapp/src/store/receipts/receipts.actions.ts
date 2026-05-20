import { RECEIPTS_SELECTED_ROWS_SET, RECEIPTS_TABLE_STATE_RESET, RECEIPTS_TABLE_STATE_SET } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

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
}

export const setReceiptsSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: RECEIPTS_SELECTED_ROWS_SET,
    payload: selectedRows,
  };
};