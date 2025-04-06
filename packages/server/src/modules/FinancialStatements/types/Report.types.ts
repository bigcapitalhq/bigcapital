export interface INumberFormatQuery {
  precision: number;
  divideOn1000: boolean;
  showZero: boolean;
  formatMoney: 'total' | 'always' | 'none';
  negativeFormat: 'parentheses' | 'mines';
}

export interface IFormatNumberSettings {
  precision?: number;
  divideOn1000?: boolean;
  excerptZero?: boolean;
  negativeFormat?: 'parentheses' | 'mines';
  thousand?: string;
  decimal?: string;
  zeroSign?: string;
  currencyCode?: string;
  money?: boolean;
}

export enum ReportsAction {
  READ_BALANCE_SHEET = 'read-balance-sheet',
  READ_TRIAL_BALANCE_SHEET = 'read-trial-balance-sheet',
  READ_PROFIT_LOSS = 'read-profit-loss',
  READ_JOURNAL = 'read-journal',
  READ_GENERAL_LEDGET = 'read-general-ledger',
  READ_CASHFLOW = 'read-cashflow',
  READ_AR_AGING_SUMMARY = 'read-ar-aging-summary',
  READ_AP_AGING_SUMMARY = 'read-ap-aging-summary',
  READ_PURCHASES_BY_ITEMS = 'read-purchases-by-items',
  READ_SALES_BY_ITEMS = 'read-sales-by-items',
  READ_CUSTOMERS_TRANSACTIONS = 'read-customers-transactions',
  READ_VENDORS_TRANSACTIONS = 'read-vendors-transactions',
  READ_CUSTOMERS_SUMMARY_BALANCE = 'read-customers-summary-balance',
  READ_VENDORS_SUMMARY_BALANCE = 'read-vendors-summary-balance',
  READ_INVENTORY_VALUATION_SUMMARY = 'read-inventory-valuation-summary',
  READ_INVENTORY_ITEM_DETAILS = 'read-inventory-item-details',
  READ_CASHFLOW_ACCOUNT_TRANSACTION = 'read-cashflow-account-transactions',
  READ_PROJECT_PROFITABILITY_SUMMARY = 'read-project-profitability-summary',
  READ_SALES_TAX_LIABILITY_SUMMARY = 'read-sales-tax-liability-summary',
}

export interface IFinancialSheetBranchesQuery {
  branchesIds?: number[];
}

export interface IFinancialSheetCommonMeta {
  organizationName: string;
  baseCurrency: string;
  dateFormat: string;
  isCostComputeRunning: boolean;
  sheetName: string;
}

export enum IFinancialDatePeriodsUnit {
  Day = 'day',
  Month = 'month',
  Year = 'year',
}

export enum IAccountTransactionsGroupBy {
  Quarter = 'quarter',
  Year = 'year',
  Day = 'day',
  Month = 'month',
  Week = 'week',
}

export interface IDateRange {
  fromDate: Date;
  toDate: Date;
}

interface FinancialDateMeta {
  date: Date;
  formattedDate: string;
}

interface IFinancialSheetTotal {
    amount: number;
    formattedAmount: string;
    currencyCode: string;
}

interface IFinancialSheetPercentage {
  amount: number;
  formattedAmount: string;
}

export interface IFinancialNodeWithPreviousPeriod {
  previousPeriodFromDate?: FinancialDateMeta;
  previousPeriodToDate?: FinancialDateMeta;

  previousPeriod?: IFinancialSheetTotal;
  previousPeriodChange?: IFinancialSheetTotal;
  previousPeriodPercentage?: IFinancialSheetPercentage;
}
export interface IFinancialNodeWithPreviousYear {
  previousYearFromDate: FinancialDateMeta;
  previousYearToDate: FinancialDateMeta;

  previousYear?: IFinancialSheetTotal;
  previousYearChange?: IFinancialSheetTotal;
  previousYearPercentage?: IFinancialSheetPercentage;
}
export interface IFinancialCommonNode {
  total: IFinancialSheetTotal;
}
export interface IFinancialCommonHorizDatePeriodNode {
  fromDate: FinancialDateMeta;
  toDate: FinancialDateMeta;
  total: IFinancialSheetTotal;
}