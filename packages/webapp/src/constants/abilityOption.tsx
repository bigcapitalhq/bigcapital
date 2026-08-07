export const AbilitySubject = {
  Item: 'Item',
  InventoryAdjustment: 'InventoryAdjustment',
  Estimate: 'SaleEstimate',
  Invoice: 'SaleInvoice',
  Receipt: 'SaleReceipt',
  PaymentReceive: 'PaymentReceive',
  Bill: 'Bill',
  PaymentMade: 'PaymentMade',
  Customer: 'Customer',
  Vendor: 'Vendor',
  Account: 'Account',
  ManualJournal: 'ManualJournal',
  Expense: 'Expense',
  Cashflow: 'Cashflow',
  Report: 'Report',
  Preferences: 'Preferences',
  ExchangeRate: 'ExchangeRate',
  SubscriptionBilling: 'SubscriptionBilling',
  CreditNote: 'CreditNote',
  VendorCredit: 'VendorCredit',
  Project: 'Project',
  TaxRate: 'TaxRate',
  BankRule: 'BankRule',
  AuditLog: 'AuditLog',
} as const;

export const ItemAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export const InventoryAdjustmentAction = {
  Create: 'Create',
  Edit: 'Edit',
  View: 'View',
  Delete: 'Delete',
} as const;

export const SaleEstimateAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
  NotifyBySms: 'NotifyBySms',
} as const;

export const SaleInvoiceAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
  Writeoff: 'bad-debt',
  NotifyBySms: 'NotifyBySms',
} as const;

export const SaleReceiptAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
  NotifyBySms: 'NotifyBySms',
} as const;

export const PaymentReceiveAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
  NotifyBySms: 'NotifyBySms',
} as const;

export const CreditNoteAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
  Refund: 'Refund',
} as const;

export const VendorCreditAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
  Refund: 'Refund',
} as const;

export const BillAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
  NotifyBySms: 'NotifyBySms',
} as const;

export const PaymentMadeAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export const CustomerAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export const VendorAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export const AccountAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
  TransactionsLocking: 'TransactionsLocking',
} as const;

export const ManualJournalAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
  TransactionLocking: 'TransactionLocking',
} as const;

export const ExpenseAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export const CashflowAction = {
  View: 'View',
  Create: 'Create',
  Delete: 'Delete',
} as const;

export const ProjectAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export const ReportsAction = {
  ALL: 'all',
  READ_BALANCE_SHEET: 'read-balance-sheet',
  READ_TRIAL_BALANCE_SHEET: 'read-trial-balance-sheet',
  READ_PROFIT_LOSS: 'read-profit-loss',
  READ_JOURNAL: 'read-journal',
  READ_GENERAL_LEDGET: 'read-general-ledger',
  READ_CASHFLOW: 'read-cashflow',
  READ_AR_AGING_SUMMARY: 'read-ar-aging-summary',
  READ_AP_AGING_SUMMARY: 'read-ap-aging-summary',
  READ_PURCHASES_BY_ITEMS: 'read-purchases-by-items',
  READ_SALES_BY_ITEMS: 'read-sales-by-items',
  READ_CUSTOMERS_TRANSACTIONS: 'read-customers-transactions',
  READ_VENDORS_TRANSACTIONS: 'read-vendors-transactions',
  READ_CUSTOMERS_SUMMARY_BALANCE: 'read-customers-summary-balance',
  READ_VENDORS_SUMMARY_BALANCE: 'read-vendors-summary-balance',
  READ_INVENTORY_VALUATION_SUMMARY: 'read-inventory-valuation-summary',
  READ_INVENTORY_ITEM_DETAILS: 'read-inventory-item-details',
  READ_CASHFLOW_ACCOUNT_TRANSACTION: 'read-cashflow-account-transactions',
  READ_SALES_TAX_LIABILITY_SUMMARY: 'read-sales-tax-liability-summary',
} as const;

export const PreferencesAbility = {
  Mutate: 'Mutate',
} as const;

export const ExchangeRateAbility = {
  View: 'view',
  Create: 'create',
  Delete: 'delete',
} as const;

export const SubscriptionBillingAbility = {
  View: 'view',
  Payment: 'payment',
} as const;

export const TaxRateAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export const BankRuleAction = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export const AuditLogAction = {
  View: 'View',
} as const;
