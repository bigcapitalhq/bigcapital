import {
  IAgingPeriod,
  IAgingSummaryQuery,
  IAgingSummaryTotal,
  IAgingSummaryContact,
  IAgingSummaryData,
} from './AgingReport';

export interface IARAgingSummaryQuery extends IAgingSummaryQuery {
  customersIds: number[];
}

export interface IARAgingSummaryCustomer extends IAgingSummaryContact {
  customerName: string;
}

export interface IARAgingSummaryTotal extends IAgingSummaryTotal {}

export interface IARAgingSummaryData extends IAgingSummaryData {
  customers: IARAgingSummaryCustomer[];
}

export type IARAgingSummaryColumns = IAgingPeriod[];

export interface IARAgingSummaryMeta {
  organizationName: string;
  baseCurrency: string;
}
