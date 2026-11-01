// Query key constants
export const ACCOUNT = 'ACCOUNT';
export const ACCOUNT_TRANSACTION = 'ACCOUNT_TRANSACTION';
export const ACCOUNTS = 'ACCOUNTS';
export const ACCOUNTS_TYPES = 'ACCOUNTS_TYPES';

// Query key factory
export const accountsKeys = {
  all: () => [ACCOUNTS] as const,
  list: (query?: Record<string, unknown> | null) => [ACCOUNTS, query] as const,
  detail: (id: number | null | undefined) => [ACCOUNT, id] as const,
  types: () => [ACCOUNTS_TYPES] as const,
  transactions: (id: number | null | undefined) =>
    [ACCOUNT_TRANSACTION, id] as const,
};

// Grouped object for use in components/hooks
export const AccountsQueryKeys = {
  ACCOUNT,
  ACCOUNT_TRANSACTION,
  ACCOUNTS,
  ACCOUNTS_TYPES,
} as const;
