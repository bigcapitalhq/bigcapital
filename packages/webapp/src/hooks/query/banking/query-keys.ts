// Query key constants for banking
export const BANK_ACCOUNT_SUMMARY_META = 'BANK_ACCOUNT_SUMMARY_META';
export const BANK_RULES = 'BANK_RULE';
export const BANK_TRANSACTION_MATCHES = 'BANK_TRANSACTION_MATCHES';
export const RECOGNIZED_BANK_TRANSACTION = 'RECOGNIZED_BANK_TRANSACTION';
export const RECOGNIZED_BANK_TRANSACTIONS_INFINITY =
  'RECOGNIZED_BANK_TRANSACTIONS_INFINITY';
export const EXCLUDED_BANK_TRANSACTIONS_INFINITY =
  'EXCLUDED_BANK_TRANSACTIONS_INFINITY';
export const PENDING_BANK_ACCOUNT_TRANSACTIONS =
  'PENDING_BANK_ACCOUNT_TRANSACTIONS';
export const PENDING_BANK_ACCOUNT_TRANSACTIONS_INFINITY =
  'PENDING_BANK_ACCOUNT_TRANSACTIONS_INFINITY';
export const AUTOFILL_CATEGORIZE_BANK_TRANSACTION =
  'AUTOFILL_CATEGORIZE_BANK_TRANSACTION';

// Query key factory
export const bankingKeys = {
  all: () => [BANK_RULES] as const,
  rules: () => [BANK_RULES] as const,
  rule: (id: number) => [BANK_RULES, id] as const,
  summaryMeta: (bankAccountId?: number) =>
    [BANK_ACCOUNT_SUMMARY_META, bankAccountId] as const,
  transactionMatches: (uncategorizedTransactionIds: number[]) =>
    [BANK_TRANSACTION_MATCHES, uncategorizedTransactionIds] as const,
  recognizedTransaction: (uncategorizedTransactionId: number) =>
    [RECOGNIZED_BANK_TRANSACTION, uncategorizedTransactionId] as const,
  recognizedTransactionsInfinity: (query?: Record<string, unknown>) =>
    [RECOGNIZED_BANK_TRANSACTIONS_INFINITY, query] as const,
  excludedTransactionsInfinity: (query?: Record<string, unknown>) =>
    [EXCLUDED_BANK_TRANSACTIONS_INFINITY, query] as const,
  pendingTransactionsInfinity: (query?: Record<string, unknown>) =>
    [PENDING_BANK_ACCOUNT_TRANSACTIONS_INFINITY, query] as const,
  pendingTransactions: () => [PENDING_BANK_ACCOUNT_TRANSACTIONS] as const,
  autofillCategorize: (uncategorizedTransactionIds: number[]) =>
    [
      AUTOFILL_CATEGORIZE_BANK_TRANSACTION,
      uncategorizedTransactionIds,
    ] as const,
};

// Grouped object for use in components/hooks
export const BankingQueryKeys = {
  BANK_ACCOUNT_SUMMARY_META,
  BANK_RULES,
  BANK_TRANSACTION_MATCHES,
  RECOGNIZED_BANK_TRANSACTION,
  RECOGNIZED_BANK_TRANSACTIONS_INFINITY,
  EXCLUDED_BANK_TRANSACTIONS_INFINITY,
  PENDING_BANK_ACCOUNT_TRANSACTIONS,
  PENDING_BANK_ACCOUNT_TRANSACTIONS_INFINITY,
  AUTOFILL_CATEGORIZE_BANK_TRANSACTION,
} as const;
