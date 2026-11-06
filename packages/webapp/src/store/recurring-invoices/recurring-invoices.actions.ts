import type { TableQuery } from '@/store/store.types';
import {
  RECURRING_INVOICES_RESET_SELECTED_ROWS,
  RECURRING_INVOICES_SET_SELECTED_ROWS,
  RECURRING_INVOICES_TABLE_STATE_RESET,
  RECURRING_INVOICES_TABLE_STATE_SET,
} from '@/store/types';

export const setRecurringInvoicesTableState = (
  queries: Partial<TableQuery>,
) => ({
  type: RECURRING_INVOICES_TABLE_STATE_SET,
  payload: { queries },
});

export const resetRecurringInvoicesTableState = () => ({
  type: RECURRING_INVOICES_TABLE_STATE_RESET,
});

export const setRecurringInvoicesSelectedRows = (
  selectedRows: Array<unknown>,
) => ({
  type: RECURRING_INVOICES_SET_SELECTED_ROWS,
  payload: selectedRows,
});

export const resetRecurringInvoicesSelectedRows = () => ({
  type: RECURRING_INVOICES_RESET_SELECTED_ROWS,
});
