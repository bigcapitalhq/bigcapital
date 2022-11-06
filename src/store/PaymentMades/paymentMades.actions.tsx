// @ts-nocheck
import t from '@/store/types';

export const setPaymentMadesTableState = (queries) => {
  return {
    type: t.PAYMENT_MADES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetPaymentMadesTableState = (queries) => {
  return {
    type: t.PAYMENT_MADES_TABLE_STATE_RESET,
    payload: { queries },
  };
};

