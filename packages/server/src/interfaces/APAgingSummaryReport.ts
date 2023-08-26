import {
  IAgingPeriod,
  IAgingPeriodTotal,
  IAgingAmount,
  IAgingSummaryQuery,
  IAgingSummaryTotal,
  IAgingSummaryContact,
  IAgingSummaryData,
} from './AgingReport';
import { INumberFormatQuery } from './FinancialStatements';

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
