import type { TableQuery } from '@/store/store.types';
import {
  PAYMENT_MADES_TABLE_STATE_RESET,
  PAYMENT_MADES_TABLE_STATE_SET,
} from '@/store/types';

export const setPaymentMadesTableState = (queries: Partial<TableQuery>) => {
  return {
    type: PAYMENT_MADES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetPaymentMadesTableState = (queries?: Partial<TableQuery>) => {
  return {
    type: PAYMENT_MADES_TABLE_STATE_RESET,
    payload: { queries },
  };
};
