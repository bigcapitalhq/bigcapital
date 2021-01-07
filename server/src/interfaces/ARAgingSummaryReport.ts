import {
  IAgingPeriod,
  IAgingPeriodTotal
} from './AgingReport';

export interface IARAgingSummaryQuery {
  asDate: Date | string;
  agingDaysBefore: number;
  agingPeriods: number;
  numberFormat: {
    noCents: number;
    divideOn1000: number;
  };
  customersIds: number[];
  noneZero: boolean;
}

export interface IARAgingSummaryCustomer {
  customerName: string;
  aging: (IAgingPeriodTotal & IAgingPeriod)[];
  total: IAgingPeriodTotal;
}

export interface IARAgingSummaryData {
  customers: IARAgingSummaryCustomer[],
  total: (IAgingPeriodTotal & IAgingPeriod)[]
}

export type IARAgingSummaryColumns = IAgingPeriod[];