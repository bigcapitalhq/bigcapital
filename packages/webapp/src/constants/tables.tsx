export const TABLES = {
  ITEMS: 'items',
  INVENTORY_ADJUSTMENTS: 'inventory_adjustment',
  ESTIMATES: 'estimates',
  INVOICES: 'invoices',
  RECURRING_INVOICES: 'recurring_invoices',
  RECEIPTS: 'receipts',
  PAYMENT_RECEIVES: 'payment_receives',
  BILLS: 'bills',
  PAYMENT_MADES: 'payment_mades',
  CUSTOMER: 'customers',
  VENDORS: 'vendors',
  ACCOUNTS: 'accounts',
  MANUAL_JOURNALS: 'manual_journal',
  RECURRING_JOURNALS: 'recurring_journals',
  EXPENSES: 'expenses',
  CASHFLOW_ACCOUNTS: 'cashflow_accounts',
  CASHFLOW_Transactions: 'cashflow_transactions',
  UNCATEGORIZED_BANK_TRANSACTION: 'UNCATEGORIZED_BANK_TRANSACTION',
  CREDIT_NOTES: 'credit_notes',
  VENDOR_CREDITS: 'vendor_credits',
  WAREHOUSE_TRANSFERS: 'warehouse_transfers',
  BUDGETS: 'budgets',
  UNCATEGORIZED_ACCOUNT_TRANSACTIONS: 'UNCATEGORIZED_ACCOUNT_TRANSACTIONS',
  EXCLUDED_BANK_TRANSACTIONS: 'EXCLUDED_BANK_TRANSACTIONS',
} as const;

export const TABLE_SIZE = {
  COMPACT: 'compact',
  SMALL: 'small',
  MEDIUM: 'medium',
} as const;

export const DEFAULT_TABLE_SIZE = TABLE_SIZE.SMALL;

/**
 * Resolves a table size to the value that should be used at runtime.
 * A missing preference falls back to the default table size (small).
 */
export const getTableSize = (size?: unknown): string =>
  size === TABLE_SIZE.MEDIUM ? TABLE_SIZE.MEDIUM : DEFAULT_TABLE_SIZE;

/**
 * Detects whether the given table size renders rows in small mode.
 */
export const isSmallTableSize = (size?: unknown): boolean =>
  getTableSize(size) === TABLE_SIZE.SMALL;
