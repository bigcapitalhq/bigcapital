// Query key constants
export const TRANSACTION_LOCKING = 'TRANSACTION_LOCKING';
export const TRANSACTIONS_LOCKING = 'TRANSACTIONS_LOCKING';

// Query key factory
export const transactionsLockingKeys = {
  all: () => [TRANSACTIONS_LOCKING] as const,
  list: (query?: Record<string, unknown>) =>
    [TRANSACTIONS_LOCKING, query] as const,
  detail: (module: string) => [TRANSACTION_LOCKING, module] as const,
};

// Grouped object for use in components/hooks
export const TransactionsLockingQueryKeys = {
  TRANSACTION_LOCKING,
  TRANSACTIONS_LOCKING,
} as const;
