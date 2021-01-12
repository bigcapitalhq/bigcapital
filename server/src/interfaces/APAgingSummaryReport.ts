import {
  IAgingPeriod,
  IAgingPeriodTotal
} from './AgingReport';
import {
  INumberFormatQuery
} from './FinancialStatements';

export interface IAPAgingSummaryQuery {
  asDate: Date | string;
  agingDaysBefore: number;
  agingPeriods: number;
  numberFormat: INumberFormatQuery;
  vendorsIds: number[];
  noneZero: boolean;
}

export interface IAPAgingSummaryVendor {
  vendorName: string,
  current: IAgingPeriodTotal,
  aging: (IAgingPeriod & IAgingPeriodTotal)[],
  total: IAgingPeriodTotal,
};

export interface IAPAgingSummaryTotal {
  current: IAgingPeriodTotal,
  aging: (IAgingPeriodTotal & IAgingPeriod)[],
};

export interface IAPAgingSummaryData {
  vendors: IAPAgingSummaryVendor[],
  total: IAPAgingSummaryTotal,
};

export type IAPAgingSummaryColumns = IAgingPeriod[];