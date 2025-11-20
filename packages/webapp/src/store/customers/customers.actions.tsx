// @ts-nocheck
import t from '@/store/types';

/**
 * Sets the customers table state.
 */
export const setCustomersTableState = (queries) => {
  return {
    type: t.CUSTOMERS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetCustomersTableState = () => {
  return {
    type: t.CUSTOMERS_TABLE_STATE_RESET,
  };
};

export const setCustomersSelectedRows = (selectedRows) => {
  return {
    type: 'CUSTOMERS/SET_SELECTED_ROWS',
    payload: selectedRows,
  };
};

export const resetCustomersSelectedRows = () => {
  return {
    type: 'CUSTOMERS/RESET_SELECTED_ROWS',
  };
};