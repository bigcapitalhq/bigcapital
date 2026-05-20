import { CUSTOMERS_TABLE_STATE_RESET, CUSTOMERS_TABLE_STATE_SET, CUSTOMERS_SET_SELECTED_ROWS, CUSTOMERS_RESET_SELECTED_ROWS } from '@/store/types';;
import type { TableQuery } from '@/store/store.types';

/**
 * Sets the customers table state.
 */
export const setCustomersTableState = (queries: Partial<TableQuery>) => {
  return {
    type: CUSTOMERS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetCustomersTableState = () => {
  return {
    type: CUSTOMERS_TABLE_STATE_RESET,
  };
};

export const setCustomersSelectedRows = (selectedRows: Array<unknown>) => {
  return {
    type: CUSTOMERS_SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};

export const resetCustomersSelectedRows = () => {
  return {
    type: CUSTOMERS_RESET_SELECTED_ROWS,
  };
};