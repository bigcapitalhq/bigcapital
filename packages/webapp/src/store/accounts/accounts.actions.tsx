// @ts-nocheck
import t from '@/store/types';

export const setAccountsTableState = (queries) => {
  return {
    type: t.ACCOUNTS_TABLE_STATE_SET,
    payload: { queries },
  };
};

/**
 * Resets the accounts table state.
 */
export const resetAccountsTableState = () => {
  return {
    type: t.ACCOUNTS_TABLE_STATE_RESET,
  };
};