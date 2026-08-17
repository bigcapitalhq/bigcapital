/**
 * Financial statement table column keys.
 *
 * Single source of truth for the `key` values emitted by the report table
 * builders and consumed by the webapp column mappers. Each report has its own
 * const/type so the values can be referenced (and type-checked) on both sides.
 */

// Shared comparison columns (previous period / previous year). Used by the
// shared `FinancialTablePreviousPeriod`/`FinancialTablePreviousYear` mixins
// across multiple reports.
export const COMPARISON_COLUMN_KEYS = {
  PREVIOUS_PERIOD: 'previous_period',
  PREVIOUS_PERIOD_CHANGE: 'previous_period_change',
  PREVIOUS_PERIOD_PERCENTAGE: 'previous_period_percentage',
  PREVIOUS_YEAR: 'previous_year',
  PREVIOUS_YEAR_CHANGE: 'previous_year_change',
  PREVIOUS_YEAR_PERCENTAGE: 'previous_year_percentage',
} as const;

export type ComparisonColumnKey =
  (typeof COMPARISON_COLUMN_KEYS)[keyof typeof COMPARISON_COLUMN_KEYS];

// ----------------------------------------
// # Balance sheet.
// ----------------------------------------
export const BALANCE_SHEET_COLUMN_KEYS = {
  NAME: 'name',
  TOTAL: 'total',
  ...COMPARISON_COLUMN_KEYS,
  PERCENTAGE_OF_COLUMN: 'percentage_of_column',
  PERCENTAGE_OF_ROW: 'percentage_of_row',
} as const;

export type BalanceSheetColumnKey =
  (typeof BALANCE_SHEET_COLUMN_KEYS)[keyof typeof BALANCE_SHEET_COLUMN_KEYS];

// ----------------------------------------
// # Profit & loss sheet.
// ----------------------------------------
export const PROFIT_LOSS_COLUMN_KEYS = {
  NAME: 'name',
  TOTAL: 'total',
  ...COMPARISON_COLUMN_KEYS,
  PERCENTAGE_OF_INCOME: 'percentage_income',
  PERCENTAGE_OF_EXPENSES: 'percentage_expenses',
  PERCENTAGE_OF_COLUMN: 'percentage_column',
  PERCENTAGE_OF_ROW: 'percentage_row',
} as const;

export type ProfitLossColumnKey =
  (typeof PROFIT_LOSS_COLUMN_KEYS)[keyof typeof PROFIT_LOSS_COLUMN_KEYS];

// ----------------------------------------
// # Trial balance sheet.
// ----------------------------------------
export const TRIAL_BALANCE_COLUMN_KEYS = {
  ACCOUNT: 'account',
  DEBIT: 'debit',
  CREDIT: 'credit',
  TOTAL: 'total',
} as const;

export type TrialBalanceColumnKey =
  (typeof TRIAL_BALANCE_COLUMN_KEYS)[keyof typeof TRIAL_BALANCE_COLUMN_KEYS];

// ----------------------------------------
// # Cash flow statement.
// ----------------------------------------
export const CASH_FLOW_COLUMN_KEYS = {
  NAME: 'name',
  TOTAL: 'total',
} as const;

export type CashFlowColumnKey =
  (typeof CASH_FLOW_COLUMN_KEYS)[keyof typeof CASH_FLOW_COLUMN_KEYS];

// ----------------------------------------
// # Aging summary (receivable & payable).
// ----------------------------------------
export const AGING_SUMMARY_COLUMN_KEYS = {
  CUSTOMER_NAME: 'customer_name',
  VENDOR_NAME: 'vendor_name',
  CURRENT: 'current',
  TOTAL: 'total',
  AGING_PERIOD: 'aging_period',
} as const;

export type AgingSummaryColumnKey =
  (typeof AGING_SUMMARY_COLUMN_KEYS)[keyof typeof AGING_SUMMARY_COLUMN_KEYS];

// ----------------------------------------
// # General ledger.
// ----------------------------------------
export const GENERAL_LEDGER_COLUMN_KEYS = {
  DATE: 'date',
  ACCOUNT_NAME: 'account_name',
  REFERENCE_TYPE: 'reference_type',
  REFERENCE_NUMBER: 'reference_number',
  DESCRIPTION: 'description',
  CREDIT: 'credit',
  DEBIT: 'debit',
  AMOUNT: 'amount',
  RUNNING_BALANCE: 'running_balance',
} as const;

export type GeneralLedgerColumnKey =
  (typeof GENERAL_LEDGER_COLUMN_KEYS)[keyof typeof GENERAL_LEDGER_COLUMN_KEYS];

// ----------------------------------------
// # Journal sheet.
// ----------------------------------------
export const JOURNAL_COLUMN_KEYS = {
  DATE: 'date',
  TRANSACTION_TYPE: 'transaction_type',
  TRANSACTION_NUMBER: 'transaction_number',
  DESCRIPTION: 'description',
  ACCOUNT_CODE: 'account_code',
  ACCOUNT_NAME: 'account_name',
  DEBIT: 'debit',
  CREDIT: 'credit',
} as const;

export type JournalColumnKey =
  (typeof JOURNAL_COLUMN_KEYS)[keyof typeof JOURNAL_COLUMN_KEYS];

// ----------------------------------------
// # Customers/vendors balance summary.
// ----------------------------------------
export const CONTACT_BALANCE_COLUMN_KEYS = {
  NAME: 'name',
  TOTAL: 'total',
  PERCENTAGE_OF_COLUMN: 'percentage_of_column',
} as const;

export type CustomersBalanceColumnKey =
  (typeof CONTACT_BALANCE_COLUMN_KEYS)[keyof typeof CONTACT_BALANCE_COLUMN_KEYS];

export type VendorsBalanceColumnKey =
  (typeof CONTACT_BALANCE_COLUMN_KEYS)[keyof typeof CONTACT_BALANCE_COLUMN_KEYS];

// ----------------------------------------
// # Sales by items.
// ----------------------------------------
export const SALES_BY_ITEMS_COLUMN_KEYS = {
  ITEM_NAME: 'item_name',
  SOLD_QUANTITY: 'sold_quantity',
  SOLD_AMOUNT: 'sold_amount',
  AVERAGE_PRICE: 'average_price',
} as const;

export type SalesByItemsColumnKey =
  (typeof SALES_BY_ITEMS_COLUMN_KEYS)[keyof typeof SALES_BY_ITEMS_COLUMN_KEYS];

// ----------------------------------------
// # Purchases by items.
// ----------------------------------------
export const PURCHASES_BY_ITEMS_COLUMN_KEYS = {
  ITEM_NAME: 'item_name',
  QUANTITY_PURCHASES: 'quantity_purchases',
  PURCHASE_AMOUNT: 'purchase_amount',
  AVERAGE_COST: 'average_cost',
} as const;

export type PurchasesByItemsColumnKey =
  (typeof PURCHASES_BY_ITEMS_COLUMN_KEYS)[keyof typeof PURCHASES_BY_ITEMS_COLUMN_KEYS];

// ----------------------------------------
// # Inventory valuation.
// ----------------------------------------
export const INVENTORY_VALUATION_COLUMN_KEYS = {
  ITEM_NAME: 'item_name',
  QUANTITY: 'quantity',
  VALUATION: 'valuation',
  AVERAGE: 'average',
} as const;

export type InventoryValuationColumnKey =
  (typeof INVENTORY_VALUATION_COLUMN_KEYS)[keyof typeof INVENTORY_VALUATION_COLUMN_KEYS];

// ----------------------------------------
// # Inventory item details.
// ----------------------------------------
export const INVENTORY_ITEM_DETAILS_COLUMN_KEYS = {
  DATE: 'date',
  TRANSACTION_TYPE: 'transaction_type',
  TRANSACTION_ID: 'transaction_id',
  QUANTITY: 'quantity',
  RATE: 'rate',
  TOTAL: 'total',
  VALUE: 'value',
  PROFIT_MARGIN: 'profit_margin',
  RUNNING_QUANTITY: 'running_quantity',
  RUNNING_VALUE: 'running_value',
} as const;

export type InventoryItemDetailsColumnKey =
  (typeof INVENTORY_ITEM_DETAILS_COLUMN_KEYS)[keyof typeof INVENTORY_ITEM_DETAILS_COLUMN_KEYS];

// ----------------------------------------
// # Sales tax liability summary.
// ----------------------------------------
export const SALES_TAX_LIABILITY_COLUMN_KEYS = {
  TAX_NAME: 'taxName',
  TAX_PERCENTAGE: 'taxPercentage',
  TAXABLE_AMOUNT: 'taxableAmount',
  COLLECTED_TAX: 'collectedTax',
  TAX_RATE: 'taxRate',
} as const;

export type SalesTaxLiabilityColumnKey =
  (typeof SALES_TAX_LIABILITY_COLUMN_KEYS)[keyof typeof SALES_TAX_LIABILITY_COLUMN_KEYS];
