import { Knex } from 'knex';

/**
 * SimpleFIN protocol types.
 * @see https://www.simplefin.org/protocol.html
 */
export interface SimpleFinOrganization {
  domain?: string;
  name?: string;
  'sfin-url': string;
  url?: string;
  id?: string;
}

export interface SimpleFinTransaction {
  id: string;
  /** Unix epoch seconds. May be 0 for pending transactions. */
  posted: number;
  /** Numeric string. Positive values are deposits. */
  amount: string;
  description: string;
  /** Unix epoch seconds, when the transaction occurred. */
  transacted_at?: number;
  pending?: boolean;
  /** Protocol v1 fields still returned by SimpleFIN Bridge. */
  payee?: string;
  memo?: string;
  extra?: Record<string, unknown>;
}

export interface SimpleFinAccount {
  org: SimpleFinOrganization;
  id: string;
  name: string;
  /** ISO 4217 code, or a URL for a custom currency. */
  currency: string;
  /** Numeric string. */
  balance: string;
  /** Numeric string. */
  'available-balance'?: string;
  /** Unix epoch seconds. */
  'balance-date': number;
  transactions?: SimpleFinTransaction[];
  holdings?: unknown[];
  extra?: Record<string, unknown>;
}

export interface SimpleFinAccountSet {
  errors: string[];
  accounts: SimpleFinAccount[];
}

export interface SimpleFinGetAccountsParams {
  /** Include transactions on or after this date. */
  startDate?: Date;
  /** Include transactions before (not on) this date. */
  endDate?: Date;
  /** Include pending transactions (excluded by default). */
  pending?: boolean;
  /** Limit the results to the given SimpleFIN account ids. */
  accountIds?: string[];
  /** Omit transactions data. */
  balancesOnly?: boolean;
}

/**
 * Application types.
 */
export interface SimpleFinClaimedAccount {
  id: string;
  name: string;
  currency: string;
  balance: number;
  availableBalance: number | null;
  balanceDate: string | null;
  connectionName: string;
}

export interface SimpleFinClaimTokenResult {
  itemId: string;
  accounts: SimpleFinClaimedAccount[];
}

export interface ISimpleFinItemLinkedEventPayload {
  simplefinItemId: string;
  connectionName: string | null;
  accountIds: number[];
}

export interface ISimpleFinTransactionsSyncedEventPayload {
  accountId: number;
  simplefinAccountId: string;
  batch: string;
  trx?: Knex.Transaction;
}

export const SimpleFinSyncQueue = 'simplefin-sync-queue';
export const SimpleFinSyncJob = 'simplefin-sync-job';

export interface SimpleFinSyncJobPayload {
  simplefinItemId: string;
  /** Skip the "is due" check and sync immediately (manual refresh). */
  force?: boolean;
}

export interface SimpleFinSyncResult {
  addedCount: number;
  skipped: boolean;
}
