// @ts-nocheck
import t from '@/store/types';

export const setReceiptsTableState = (queries) => {
  return {
    type: t.RECEIPTS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetReceiptsTableState = () => {
  return {
    type: t.RECEIPTS_TABLE_STATE_RESET,
  };
}

export const setReceiptsSelectedRows = (selectedRows) => {
  return {
    type: t.RECEIPTS_SELECTED_ROWS_SET,
    payload: selectedRows,
  };
};