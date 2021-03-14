import {
  IAgingPeriod,
  IAgingPeriodTotal,
  IAgingAmount
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
  current: IAgingAmount,
  aging: IAgingPeriodTotal[],
  total: IAgingAmount,
};

export interface IAPAgingSummaryTotal {
  current: IAgingAmount,
  aging: IAgingPeriodTotal[],
  total: IAgingAmount,
};

export interface IAPAgingSummaryData {
  vendors: IAPAgingSummaryVendor[],
  total: IAPAgingSummaryTotal,
};

export type IAPAgingSummaryColumns = IAgingPeriod[];


export interface IARAgingSummaryMeta {
  baseCurrency: string,
  organizationName: string,
}


export interface IAPAgingSummaryMeta {
  baseCurrency: string,
  organizationName: string,
}