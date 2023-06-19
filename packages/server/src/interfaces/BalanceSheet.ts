import {
  INumberFormatQuery,
  IFormatNumberSettings,
  IFinancialSheetBranchesQuery,
} from './FinancialStatements';

// Balance sheet schema nodes types.
export enum BALANCE_SHEET_SCHEMA_NODE_TYPE {
  AGGREGATE = 'AGGREGATE',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT = 'ACCOUNT',
}

export enum BALANCE_SHEET_NODE_TYPE {
  AGGREGATE = 'AGGREGATE',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT = 'ACCOUNT',
}

// Balance sheet schema nodes ids.
export enum BALANCE_SHEET_SCHEMA_NODE_ID {
  ASSETS = 'ASSETS',
  CURRENT_ASSETS = 'CURRENT_ASSETS',
  CASH_EQUIVALENTS = 'CASH_EQUIVALENTS',
  ACCOUNTS_RECEIVABLE = 'ACCOUNTS_RECEIVABLE',
  NON_CURRENT_ASSET = 'NON_CURRENT_ASSET',
  FIXED_ASSET = 'FIXED_ASSET',
  OTHER_CURRENT_ASSET = 'OTHER_CURRENT_ASSET',
  INVENTORY = 'INVENTORY',
  LIABILITY_EQUITY = 'LIABILITY_EQUITY',
  LIABILITY = 'LIABILITY',
  CURRENT_LIABILITY = 'CURRENT_LIABILITY',
  LOGN_TERM_LIABILITY = 'LOGN_TERM_LIABILITY',
  NON_CURRENT_LIABILITY = 'NON_CURRENT_LIABILITY',
  EQUITY = 'EQUITY',
}

// Balance sheet query.
export interface IBalanceSheetQuery extends IFinancialSheetBranchesQuery {
  displayColumnsType: 'total' | 'date_periods';
  displayColumnsBy: string;
  fromDate: Date;
  toDate: Date;
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;
  noneZero: boolean;
  basis: 'cash' | 'accrual';
  accountIds: number[];

  percentageOfColumn: boolean;
  percentageOfRow: boolean;

  previousPeriod: boolean;
  previousPeriodAmountChange: boolean;
  previousPeriodPercentageChange: boolean;

  previousYear: boolean;
  previousYearAmountChange: boolean;
  previousYearPercentageChange: boolean;
}

// Balance sheet meta.
export interface IBalanceSheetMeta {
  isCostComputeRunning: boolean;
  organizationName: string;
  baseCurrency: string;
}

export interface IBalanceSheetFormatNumberSettings
  extends IFormatNumberSettings {
  type: string;
}

// Balance sheet service.
export interface IBalanceSheetStatementService {
  balanceSheet(
    tenantId: number,
    query: IBalanceSheetQuery
  ): Promise<IBalanceSheetDOO>;
}

export type IBalanceSheetStatementData = IBalanceSheetDataNode[];

export interface IBalanceSheetDOO {
  query: IBalanceSheetQuery;
  data: IBalanceSheetStatementData;
  meta: IBalanceSheetMeta;
}


export interface IBalanceSheetCommonNode {
  total: IBalanceSheetTotal;
  horizontalTotals?: IBalanceSheetTotal[];

  percentageRow?: IBalanceSheetPercentageAmount;
  percentageColumn?: IBalanceSheetPercentageAmount;

  previousPeriod?: IBalanceSheetTotal;
  previousPeriodChange?: IBalanceSheetTotal;
  previousPeriodPercentage?: IBalanceSheetPercentageAmount;

  previousYear?: IBalanceSheetTotal;
  previousYearChange?: IBalanceSheetTotal;
  previousYearPercentage?: IBalanceSheetPercentageAmount;
}

export interface IBalanceSheetAggregateNode extends IBalanceSheetCommonNode {
  id: string;
  name: string;
  nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE;
  children?: (IBalanceSheetAggregateNode | IBalanceSheetAccountNode)[];
}

export interface IBalanceSheetTotal {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
  date?: string | Date;
}

export interface IBalanceSheetAccountNode extends IBalanceSheetCommonNode {
  id: number;
  index: number;
  name: string;
  code: string;
  parentAccountId?: number;
  nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNT;
  children?: IBalanceSheetAccountNode[];
}

export type IBalanceSheetDataNode = IBalanceSheetAggregateNode;

export interface IBalanceSheetPercentageAmount {
  amount: number;
  formattedAmount: string;
}

export interface IBalanceSheetSchemaAggregateNode {
  name: string;
  id: string;
  type: BALANCE_SHEET_SCHEMA_NODE_TYPE;
  children: IBalanceSheetSchemaNode[];
  alwaysShow: boolean;
}

export interface IBalanceSheetSchemaAccountNode {
  name: string;
  id: string;
  type: BALANCE_SHEET_SCHEMA_NODE_TYPE;
  accountsTypes: string[];
}

export type IBalanceSheetSchemaNode =
  | IBalanceSheetSchemaAccountNode
  | IBalanceSheetSchemaAggregateNode;

export interface IBalanceSheetDatePeriods {
  assocAccountNodeDatePeriods(node): any;
  initDateRangeCollection(): void;
}

export interface IBalanceSheetComparisons {
  assocPreviousYearAccountNode(node);
  hasPreviousPeriod(): boolean;
  hasPreviousYear(): boolean;
  assocPreviousPeriodAccountNode(node);
}

export interface IBalanceSheetTotalPeriod extends IFinancialSheetTotalPeriod {
  percentageRow?: IBalanceSheetPercentageAmount;
  percentageColumn?: IBalanceSheetPercentageAmount;
}

export interface IFinancialSheetTotalPeriod {
  fromDate: any;
  toDate: any;
  total: any;
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
