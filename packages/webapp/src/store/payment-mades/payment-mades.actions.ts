import type { TableQuery } from '@/store/store.types';
import {
  PAYMENT_MADES_TABLE_STATE_RESET,
  PAYMENT_MADES_TABLE_STATE_SET,
  PAYMENT_MADES_SET_SELECTED_ROWS,
  PAYMENT_MADES_RESET_SELECTED_ROWS,
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

export const setPaymentMadesSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: PAYMENT_MADES_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};

export const resetPaymentMadesSelectedRows = () => {
  return {
    type: PAYMENT_MADES_RESET_SELECTED_ROWS,
  };
};
