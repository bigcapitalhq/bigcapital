// Query key constants
export const CASH_FLOW_ACCOUNTS = 'CASH_FLOW_ACCOUNTS';
export const CASH_FLOW_TRANSACTIONS = 'CASH_FLOW_TRANSACTIONS';
export const CASH_FLOW_TRANSACTION = 'CASH_FLOW_TRANSACTION';
export const CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY =
  'CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY';
export const CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY =
  'CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY';
export const CASHFLOW_UNCAATEGORIZED_TRANSACTION =
  'CASHFLOW_UNCAATEGORIZED_TRANSACTION';

// Query key factory
export const cashflowAccountsKeys = {
  all: () => [CASH_FLOW_ACCOUNTS] as const,
  list: (query?: Record<string, unknown>) =>
    [CASH_FLOW_ACCOUNTS, query] as const,
  transactions: (id?: string | number | null) =>
    [CASH_FLOW_TRANSACTIONS, id] as const,
  transaction: (id?: string | number | null) =>
    [CASH_FLOW_TRANSACTION, id] as const,
  transactionsInfinity: (accountId?: number, query?: Record<string, unknown>) =>
    [CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY, accountId, query] as const,
  uncategorizedInfinity: (
    accountId?: number,
    query?: Record<string, unknown>,
  ) =>
    [
      CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
      accountId,
      query,
    ] as const,
  uncategorizedTransaction: (id?: number | null) =>
    [CASHFLOW_UNCAATEGORIZED_TRANSACTION, id] as const,
};

// Grouped object for use in components/hooks
export const CashflowAccountsQueryKeys = {
  CASH_FLOW_ACCOUNTS,
  CASH_FLOW_TRANSACTIONS,
  CASH_FLOW_TRANSACTION,
  CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY,
  CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
  CASHFLOW_UNCAATEGORIZED_TRANSACTION,
} as const;
