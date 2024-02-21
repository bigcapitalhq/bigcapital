import {
  IFinancialSheetCommonMeta,
  INumberFormatQuery,
} from './FinancialStatements';

export interface IAgingPeriodTotal extends IAgingPeriod {
  total: IAgingAmount;
}

export interface IAgingAmount {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface IAgingPeriod {
  fromPeriod: Date | string;
  toPeriod: Date | string;
  beforeDays: number;
  toDays: number;
}

export interface IAgingSummaryContact {
  current: IAgingAmount;
  aging: IAgingPeriodTotal[];
  total: IAgingAmount;
}

export interface IAgingSummaryQuery {
  asDate: Date | string;
  agingDaysBefore: number;
  agingPeriods: number;
  numberFormat: INumberFormatQuery;
  branchesIds: number[];
  noneZero: boolean;
}

export interface IAgingSummaryTotal {
  current: IAgingAmount;
  aging: IAgingPeriodTotal[];
  total: IAgingAmount;
}

export interface IAgingSummaryData {
  total: IAgingSummaryTotal;
}

export interface IAgingSummaryMeta extends IFinancialSheetCommonMeta {
  formattedAsDate: string;
  formattedDateRange: string;
}
