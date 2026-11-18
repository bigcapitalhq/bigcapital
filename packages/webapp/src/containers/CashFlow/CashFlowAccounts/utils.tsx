import type { CashflowAccountRow } from './components';
import { transformTableStateToQuery } from '@/utils';

export const CASHFLOW_ACCOUNT_SYNC_STATUS = {
  SYNCED: 'synced',
  PAUSED: 'paused',
  NOT_CONNECTED: 'not-connected',
} as const;

export type CashflowAccountSyncStatus =
  (typeof CASHFLOW_ACCOUNT_SYNC_STATUS)[keyof typeof CASHFLOW_ACCOUNT_SYNC_STATUS];

/**
 * Determines the bank feeds sync status of the given bank account.
 */
export function getCashflowAccountSyncStatus(
  account: CashflowAccountRow,
): CashflowAccountSyncStatus {
  if (!account.plaidItemId || !account.isFeedsActive) {
    return CASHFLOW_ACCOUNT_SYNC_STATUS.NOT_CONNECTED;
  }
  return account.isFeedsPaused
    ? CASHFLOW_ACCOUNT_SYNC_STATUS.PAUSED
    : CASHFLOW_ACCOUNT_SYNC_STATUS.SYNCED;
}

export const transformAccountsStateToQuery = (
  tableState: { inactiveMode?: boolean } & Record<string, unknown>,
) => {
  return {
    ...transformTableStateToQuery(tableState),
    inactiveMode: tableState.inactiveMode,
  };
};
