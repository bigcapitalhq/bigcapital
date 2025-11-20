// @ts-nocheck
import t from '@/store/types';

export const setBillsTableState = (queries) => {
  return {
    type: t.BILLS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetBillsTableState = () => {
  return {
    type: t.BILLS_TABLE_STATE_RESET,
  };
};

export const setBillsSelectedRows = (selectedRows) => {
  return {
    type: 'BILLS/SET_SELECTED_ROWS',
    payload: selectedRows,
  };
};
