export const CLICKHOUSE_CLIENT = 'CLICKHOUSE_CLIENT';

export const LEDGER_DELTA_TABLE = 'ledger_delta';
export const ACCOUNTS_DIM_TABLE = 'accounts_dim';

export const LedgerAnalyticsSyncQueue = 'ledger-analytics-sync';
export const LedgerAnalyticsReconcileQueue = 'ledger-analytics-reconcile';

export const LEDGER_ANALYTICS_DIRTY_SET_KEY = 'analytics:ledger:dirty-orgs';

/**
 * Signed delta of ledger entries of a single account.
 * `credit`/`debit` are the raw (possibly negated for deletions) amounts.
 */
export interface ILedgerDelta {
  accountId: number;
  credit: number;
  debit: number;
}

/**
 * Bull job payload to sync ledger deltas of a single organization
 * into the ClickHouse analytics store.
 */
export interface ILedgerAnalyticsSyncJobPayload {
  organizationId: string;
  deltas: ILedgerDelta[];
  accountIds: number[];
}

/**
 * Bull job payload to rebuild the whole organization data in ClickHouse
 * from the tenant database (reconcile/repair/backfill).
 */
export interface ILedgerAnalyticsReconcileJobPayload {
  organizationId?: string;
  all?: boolean;
}

/**
 * Account balance aggregation row used by both the ClickHouse query
 * and the tenant database fallback.
 */
export interface IAccountBalanceRow {
  organizationId: string;
  accountType: string;
  accountNormal: string;
  active: number;
  credit: number;
  debit: number;
}

export interface IOrgFinancialTotals {
  totalAssets: number;
  totalLiabilities: number;
}

export type OrgFinancialTotalsMap = Map<string, IOrgFinancialTotals>;
