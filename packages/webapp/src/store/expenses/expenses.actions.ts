import type { TableQuery } from '@/store/store.types';
import {
  EXPENSES_TABLE_STATE_RESET,
  EXPENSES_TABLE_STATE_SET,
  EXPENSES_SET_SELECTED_ROWS,
} from '@/store/types';

/**
 * Sets global table state of the table.
 * @param {object} queries
 */
export const setExpensesTableState = (queries: Partial<TableQuery>) => {
  return {
    type: EXPENSES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetExpensesTableState = () => {
  return {
    type: EXPENSES_TABLE_STATE_RESET,
  };
};

export const setExpensesSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: EXPENSES_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};
