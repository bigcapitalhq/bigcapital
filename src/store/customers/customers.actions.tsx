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
}