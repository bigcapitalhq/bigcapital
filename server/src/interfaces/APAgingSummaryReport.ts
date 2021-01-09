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