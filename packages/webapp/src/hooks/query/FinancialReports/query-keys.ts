export const FINANCIAL_REPORT = 'FINANCIAL-REPORT';
export const BALANCE_SHEET = 'BALANCE-SHEET';
export const TRIAL_BALANCE_SHEET = 'TRIAL-BALANCE-SHEET';
export const PROFIT_LOSS_SHEET = 'PROFIT-LOSS-SHEET';
export const GENERAL_LEDGER = 'GENERAL-LEDGER';
export const JOURNAL = 'JOURNAL';
export const AR_AGING_SUMMARY = 'AR-AGING-SUMMARY';
export const AP_AGING_SUMMARY = 'AP-AGING-SUMMARY';
export const VENDORS_TRANSACTIONS = 'VENDORS_TRANSACTIONS';
export const CUSTOMERS_TRANSACTIONS = 'CUSTOMERS_TRANSACTIONS';
export const VENDORS_BALANCE_SUMMARY = 'VENDORS_BALANCE_SUMMARY';
export const CUSTOMERS_BALANCE_SUMMARY = 'CUSTOMERS_BALANCE_SUMMARY';
export const SALES_BY_ITEMS = 'SALES_BY_ITEMS';
export const PURCHASES_BY_ITEMS = 'PURCHASES_BY_ITEMS';
export const INVENTORY_VALUATION = 'INVENTORY_VALUATION';
export const CASH_FLOW_STATEMENT = 'CASH_FLOW_STATEMENT';
export const INVENTORY_ITEM_DETAILS = 'INVENTORY_ITEM_DETAILS';
export const TRANSACTIONS_BY_REFERENCE = 'TRANSACTIONS_BY_REFERENCE';
export const REALIZED_GAIN_OR_LOSS = 'REALIZED_GAIN_OR_LOSS';
export const UNREALIZED_GAIN_OR_LOSS = 'UNREALIZED_GAIN_OR_LOSS';
export const SALES_TAX_LIABILITY_SUMMARY = 'SALES_TAX_LIABILITY_SUMMARY';

// Query key factory
export const financialReportsKeys = {
  all: () => [FINANCIAL_REPORT] as const,
  balanceSheet: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, BALANCE_SHEET, query] as const,
  trialBalance: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, TRIAL_BALANCE_SHEET, query] as const,
  profitLoss: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, PROFIT_LOSS_SHEET, query] as const,
  generalLedger: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, GENERAL_LEDGER, query] as const,
  journal: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, JOURNAL, query] as const,
  arAgingSummary: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, AR_AGING_SUMMARY, query] as const,
  apAgingSummary: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, AP_AGING_SUMMARY, query] as const,
  vendorTransactions: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, VENDORS_TRANSACTIONS, query] as const,
  customerTransactions: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, CUSTOMERS_TRANSACTIONS, query] as const,
  vendorBalanceSummary: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, VENDORS_BALANCE_SUMMARY, query] as const,
  customerBalanceSummary: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, CUSTOMERS_BALANCE_SUMMARY, query] as const,
  salesByItems: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, SALES_BY_ITEMS, query] as const,
  purchasesByItems: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, PURCHASES_BY_ITEMS, query] as const,
  inventoryValuation: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, INVENTORY_VALUATION, query] as const,
  cashFlowStatement: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, CASH_FLOW_STATEMENT, query] as const,
  inventoryItemDetails: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, INVENTORY_ITEM_DETAILS, query] as const,
  transactionsByReference: (query?: Record<string, unknown>) =>
    [TRANSACTIONS_BY_REFERENCE, query] as const,
  realizedGainOrLoss: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, REALIZED_GAIN_OR_LOSS, query] as const,
  unrealizedGainOrLoss: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, UNREALIZED_GAIN_OR_LOSS, query] as const,
  salesTaxLiability: (query?: Record<string, unknown>) =>
    [FINANCIAL_REPORT, SALES_TAX_LIABILITY_SUMMARY, query] as const,
};

// Grouped object for use in components/hooks
export const FinancialReportsQueryKeys = {
  FINANCIAL_REPORT,
  BALANCE_SHEET,
  TRIAL_BALANCE_SHEET,
  PROFIT_LOSS_SHEET,
  GENERAL_LEDGER,
  JOURNAL,
  AR_AGING_SUMMARY,
  AP_AGING_SUMMARY,
  VENDORS_TRANSACTIONS,
  CUSTOMERS_TRANSACTIONS,
  VENDORS_BALANCE_SUMMARY,
  CUSTOMERS_BALANCE_SUMMARY,
  SALES_BY_ITEMS,
  PURCHASES_BY_ITEMS,
  INVENTORY_VALUATION,
  CASH_FLOW_STATEMENT,
  INVENTORY_ITEM_DETAILS,
  TRANSACTIONS_BY_REFERENCE,
  REALIZED_GAIN_OR_LOSS,
  UNREALIZED_GAIN_OR_LOSS,
  SALES_TAX_LIABILITY_SUMMARY,
} as const;
