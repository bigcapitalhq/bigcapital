// @ts-nocheck
import t from '@/store/types';

export const setInvoicesTableState = (queries) => {
  return {
    type: t.INVOICES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetInvoicesTableState= () => {
  return {
    type: t.INVOICES_TABLE_STATE_RESET,
  };
}

export const setInvoicesSelectedRows = (selectedRows) => {
  return {
    type: 'INVOICES/SET_SELECTED_ROWS',
    payload: selectedRows,
  };
};

export const resetInvoicesSelectedRows = () => {
  return {
    type: 'INVOICES/RESET_SELECTED_ROWS',
  };
};