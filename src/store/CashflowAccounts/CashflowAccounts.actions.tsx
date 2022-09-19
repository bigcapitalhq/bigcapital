// @ts-nocheck
import t from '@/store/types';

/**
 * Sets the cashflow accounts table state.
 */
export const setCashflowAccountsTableState = (queries) => {
  return {
    type: t.CASHFLOW_ACCOUNTS_TABLE_STATE_SET,
    payload: { queries },
  };
};

/**
 * Resets the cashflow accounts table state.
 */
export const resetCashflowAccountsTableState = () => {
  return {
    type: t.CASHFLOW_ACCOUNTS_TABLE_STATE_RESET,
  };
};
 