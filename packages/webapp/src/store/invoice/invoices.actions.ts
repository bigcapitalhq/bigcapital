import { INVOICES_TABLE_STATE_RESET, INVOICES_TABLE_STATE_SET, INVOICES_SET_SELECTED_ROWS, INVOICES_RESET_SELECTED_ROWS } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

export const setInvoicesTableState = (queries: Partial<TableQuery>) => {
  return {
    type: INVOICES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetInvoicesTableState= () => {
  return {
    type: INVOICES_TABLE_STATE_RESET,
  };
}

export const setInvoicesSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: INVOICES_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};

export const resetInvoicesSelectedRows = () => {
  return {
    type: INVOICES_RESET_SELECTED_ROWS,
  };
};