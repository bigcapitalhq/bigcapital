// @ts-nocheck
import t from '@/store/types';

export const setPaymentsMadeTableState = (queries) => {
  return {
    type: t.PAYMENTS_MADE_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetPaymentsMadeTableState = (queries) => {
  return {
    type: t.PAYMENTS_MADE_TABLE_STATE_RESET,
    payload: { queries },
  };
};

