import {
  IAgingPeriod,
  IAgingPeriodTotal
} from './AgingReport';

export interface IARAgingSummaryQuery {
  asDate: Date | string;
  agingDaysBefore: number;
  agingPeriods: number;
  numberFormat: {
    noCents: boolean;
    divideOn1000: boolean;
  };
  customersIds: number[];
  noneZero: boolean;
}

export interface IARAgingSummaryCustomer {
  customerName: string;
  current: IAgingPeriodTotal,
  aging: (IAgingPeriodTotal & IAgingPeriod)[];
  total: IAgingPeriodTotal;
}

export interface IARAgingSummaryTotal {
  current: IAgingPeriodTotal,
  aging: (IAgingPeriodTotal & IAgingPeriod)[],
};

export interface IARAgingSummaryData {
  customers: IARAgingSummaryCustomer[],
  total: IARAgingSummaryTotal,
};

export type IARAgingSummaryColumns = IAgingPeriod[];