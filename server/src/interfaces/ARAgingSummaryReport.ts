import {
  IAgingPeriod,
  IAgingPeriodTotal
} from './AgingReport';
import {
  INumberFormatQuery
} from './FinancialStatements';

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
  current: IAgingPeriodTotal,
  aging: (IAgingPeriodTotal & IAgingPeriod)[];
  total: IAgingPeriodTotal;
}

export interface IARAgingSummaryTotal {
  current: IAgingPeriodTotal,
  aging: (IAgingPeriodTotal & IAgingPeriod)[],
  total: IAgingPeriodTotal,
};

export interface IARAgingSummaryData {
  customers: IARAgingSummaryCustomer[],
  total: IARAgingSummaryTotal,
};

export type IARAgingSummaryColumns = IAgingPeriod[];