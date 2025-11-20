// @ts-nocheck
import t from '@/store/types';

export const setPaymentReceivesTableState = (queries) => {
  return {
    type: t.PAYMENT_RECEIVES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetPaymentReceivesTableState = () => {
  return {
    type: t.PAYMENT_RECEIVES_TABLE_STATE_RESET
  };
}

export const setPaymentReceivesSelectedRows = (selectedRows) => {
  return {
    type: 'PAYMENT_RECEIVES/SET_SELECTED_ROWS',
    payload: selectedRows,
  };
};

