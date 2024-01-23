import {
  IAgingPeriod,
  IAgingSummaryQuery,
  IAgingSummaryTotal,
  IAgingSummaryContact,
  IAgingSummaryData,
} from './AgingReport';
import { IFinancialTable } from './Table';

export interface IAPAgingSummaryQuery extends IAgingSummaryQuery {
  vendorsIds: number[];
}

export interface IAPAgingSummaryVendor extends IAgingSummaryContact {
  vendorName: string;
}

export interface IAPAgingSummaryTotal extends IAgingSummaryTotal {}

export interface IAPAgingSummaryData extends IAgingSummaryData {
  vendors: IAPAgingSummaryVendor[];
}

export type IAPAgingSummaryColumns = IAgingPeriod[];

export interface IARAgingSummaryMeta {
  baseCurrency: string;
  organizationName: string;
}

export interface IAPAgingSummaryMeta {
  baseCurrency: string;
  organizationName: string;
}

export interface IAPAgingSummaryTable extends IFinancialTable {
  query: IAPAgingSummaryQuery;
  meta: IAPAgingSummaryMeta;
}
