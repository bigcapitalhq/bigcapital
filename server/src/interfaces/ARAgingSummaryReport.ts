import { IAgingPeriod, IAgingPeriodTotal, IAgingAmount } from './AgingReport';
import { INumberFormatQuery } from './FinancialStatements';

export interface IARAgingSummaryQuery {
  asDate: Date | string;
  agingDaysBefore: number;
  agingPeriods: number;
  numberFormat: INumberFormatQuery;
  customersIds: number[];
  noneZero: boolean;
}

export interface IARAgingSummaryCustomer {
  customerName: string;
  current: IAgingAmount;
  aging: IAgingPeriodTotal[];
  total: IAgingAmount;
}

export interface IARAgingSummaryTotal {
  current: IAgingAmount;
  aging: IAgingPeriodTotal[];
  total: IAgingAmount;
}

export interface IARAgingSummaryData {
  customers: IARAgingSummaryCustomer[];
  total: IARAgingSummaryTotal;
}

export type IARAgingSummaryColumns = IAgingPeriod[];

export interface IARAgingSummaryMeta {
  organizationName: string,
  baseCurrency: string,
}