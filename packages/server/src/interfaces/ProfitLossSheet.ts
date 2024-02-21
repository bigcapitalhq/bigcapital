import {
  IFinancialSheetBranchesQuery,
  IFinancialSheetCommonMeta,
  INumberFormatQuery,
} from './FinancialStatements';
import { IFinancialTable } from './Table';

export enum ProfitLossAggregateNodeId {
  INCOME = 'INCOME',
  COS = 'COST_OF_SALES',
  GROSS_PROFIT = 'GROSS_PROFIT',
  EXPENSES = 'EXPENSES',
  OTHER_INCOME = 'OTHER_INCOME',
  OTHER_EXPENSES = 'OTHER_EXPENSES',
  OPERATING_PROFIT = 'OPERATING_PROFIT',
  NET_OTHER_INCOME = 'NET_OTHER_INCOME',
  NET_INCOME = 'NET_INCOME',
  NET_OPERATING_INCOME = 'NET_OPERATING_INCOME',
}

export enum ProfitLossNodeType {
  EQUATION = 'EQUATION',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT = 'ACCOUNT',
  AGGREGATE = 'AGGREGATE',
}
interface FinancialDateMeta {
  date: Date;
  formattedDate: string;
}
export interface IFinancialNodeWithPreviousPeriod {
  previousPeriodFromDate?: FinancialDateMeta;
  previousPeriodToDate?: FinancialDateMeta;

  previousPeriod?: IProfitLossSheetTotal;
  previousPeriodChange?: IProfitLossSheetTotal;
  previousPeriodPercentage?: IProfitLossSheetPercentage;
}
export interface IFinancialNodeWithPreviousYear {
  previousYearFromDate: FinancialDateMeta;
  previousYearToDate: FinancialDateMeta;

  previousYear?: IProfitLossSheetTotal;
  previousYearChange?: IProfitLossSheetTotal;
  previousYearPercentage?: IProfitLossSheetPercentage;
}
export interface IFinancialCommonNode {
  total: IProfitLossSheetTotal;
}
export interface IFinancialCommonHorizDatePeriodNode {
  fromDate: FinancialDateMeta;
  toDate: FinancialDateMeta;
  total: IProfitLossSheetTotal;
}
export interface IProfitLossSheetQuery extends IFinancialSheetBranchesQuery {
  basis: string;
  fromDate: Date;
  toDate: Date;
  numberFormat: INumberFormatQuery;
  noneZero: boolean;
  noneTransactions: boolean;
  accountsIds: number[];

  displayColumnsType: 'total' | 'date_periods';
  displayColumnsBy: string;

  percentageColumn: boolean;
  percentageRow: boolean;

  percentageIncome: boolean;
  percentageExpense: boolean;

  previousPeriod: boolean;
  previousPeriodAmountChange: boolean;
  previousPeriodPercentageChange: boolean;

  previousYear: boolean;
  previousYearAmountChange: boolean;
  previousYearPercentageChange: boolean;
}

export interface IProfitLossSheetTotal {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface IProfitLossSheetPercentage {
  amount: number;
  formattedAmount: string;
}

export interface IProfitLossHorizontalDatePeriodNode
  extends IFinancialNodeWithPreviousYear,
    IFinancialNodeWithPreviousPeriod {
  fromDate: FinancialDateMeta;
  toDate: FinancialDateMeta;

  total: IProfitLossSheetTotal;

  percentageRow?: IProfitLossSheetPercentage;
  percentageColumn?: IProfitLossSheetPercentage;
}

export interface IProfitLossSheetCommonNode
  extends IFinancialNodeWithPreviousYear,
    IFinancialNodeWithPreviousPeriod {
  id: ProfitLossAggregateNodeId;
  name: string;

  children?: IProfitLossSheetNode[];

  total: IProfitLossSheetTotal;
  horizontalTotals?: IProfitLossHorizontalDatePeriodNode[];

  percentageRow?: IProfitLossSheetPercentage;
  percentageColumn?: IProfitLossSheetPercentage;
}
export interface IProfitLossSheetAccountNode
  extends IProfitLossSheetCommonNode {
  nodeType: ProfitLossNodeType.ACCOUNT;
}
export interface IProfitLossSheetEquationNode
  extends IProfitLossSheetCommonNode {
  nodeType: ProfitLossNodeType.EQUATION;
}

export interface IProfitLossSheetAccountsNode
  extends IProfitLossSheetCommonNode {
  nodeType: ProfitLossNodeType.ACCOUNTS;
}

export type IProfitLossSheetNode =
  | IProfitLossSheetAccountsNode
  | IProfitLossSheetEquationNode
  | IProfitLossSheetAccountNode;

export interface IProfitLossSheetMeta extends IFinancialSheetCommonMeta{
  formattedDateRange: string;
  formattedFromDate: string;
  formattedToDate: string;
}

// ------------------------------------------------
// # SCHEMA NODES
// ------------------------------------------------
export interface IProfitLossCommonSchemaNode {
  id: ProfitLossAggregateNodeId;
  name: string;
  nodeType: ProfitLossNodeType;
  children?: IProfitLossSchemaNode[];
  alwaysShow?: boolean;
}

export interface IProfitLossEquationSchemaNode
  extends IProfitLossCommonSchemaNode {
  nodeType: ProfitLossNodeType.EQUATION;
  equation: string;
}

export interface IProfitLossAccountsSchemaNode
  extends IProfitLossCommonSchemaNode {
  nodeType: ProfitLossNodeType.ACCOUNTS;
  accountsTypes: string[];
}

export type IProfitLossSchemaNode =
  | IProfitLossCommonSchemaNode
  | IProfitLossAccountsSchemaNode
  | IProfitLossEquationSchemaNode;

// ------------------------------
// # Table
// ------------------------------

export enum ProfitLossSheetRowType {
  AGGREGATE = 'AGGREGATE',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT = 'ACCOUNT',
  TOTAL = 'TOTAL',
}


export interface IProfitLossSheetTable extends IFinancialTable{
  meta: IProfitLossSheetMeta;
  query: IProfitLossSheetQuery;
}