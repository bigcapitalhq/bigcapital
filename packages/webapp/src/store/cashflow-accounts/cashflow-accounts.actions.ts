import type { TableQuery } from '@/store/store.types';
import {
  CASHFLOW_ACCOUNTS_TABLE_STATE_RESET,
  CASHFLOW_ACCOUNTS_TABLE_STATE_SET,
} from '@/store/types';

/**
 * Sets the cashflow accounts table state.
 */
export const setCashflowAccountsTableState = (queries: Partial<TableQuery>) => {
  return {
    type: CASHFLOW_ACCOUNTS_TABLE_STATE_SET,
    payload: { queries },
  };
};

/**
 * Resets the cashflow accounts table state.
 */
export const resetCashflowAccountsTableState = () => {
  return {
    type: CASHFLOW_ACCOUNTS_TABLE_STATE_RESET,
  };
};
