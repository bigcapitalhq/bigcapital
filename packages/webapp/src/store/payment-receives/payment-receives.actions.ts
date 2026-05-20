import { PAYMENT_RECEIVES_TABLE_STATE_RESET, PAYMENT_RECEIVES_TABLE_STATE_SET, PAYMENT_RECEIVES_SET_SELECTED_ROWS } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

export const setPaymentReceivesTableState = (queries: Partial<TableQuery>) => {
  return {
    type: PAYMENT_RECEIVES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetPaymentReceivesTableState = () => {
  return {
    type: PAYMENT_RECEIVES_TABLE_STATE_RESET
  };
}

export const setPaymentReceivesSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: PAYMENT_RECEIVES_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};

