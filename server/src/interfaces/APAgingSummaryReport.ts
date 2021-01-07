import {
  IAgingPeriod,
  IAgingPeriodTotal
} from './AgingReport';

export interface IAPAgingSummaryQuery {
  asDate: Date | string;
  agingDaysBefore: number;
  agingPeriods: number;
  numberFormat: {
    noCents: boolean;
    divideOn1000: boolean;
  };
  vendorsIds: number[];
  noneZero: boolean;
}

export interface IAPAgingSummaryVendor {
  vendorName: string,
  aging: (IAgingPeriod & IAgingPeriodTotal)[],
  total: IAgingPeriodTotal,
}

export interface IAPAgingSummaryData {
  vendors: IAPAgingSummaryVendor[],
  total: (IAgingPeriod & IAgingPeriodTotal)[],
}

export type IAPAgingSummaryColumns = IAgingPeriod[];