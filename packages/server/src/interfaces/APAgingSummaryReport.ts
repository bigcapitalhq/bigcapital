import {
  IAgingPeriod,
  IAgingSummaryQuery,
  IAgingSummaryTotal,
  IAgingSummaryContact,
  IAgingSummaryData,
} from './AgingReport';
import { IFinancialSheetCommonMeta } from './FinancialStatements';
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

export interface IARAgingSummaryMeta extends IFinancialSheetCommonMeta {
  formattedAsDate: string;
}

export interface IAPAgingSummaryMeta extends IFinancialSheetCommonMeta {
  formattedAsDate: string;
}

export interface IAPAgingSummaryTable extends IFinancialTable {
  query: IAPAgingSummaryQuery;
  meta: IAPAgingSummaryMeta;
}

export interface IAPAgingSummarySheet {
  data: IAPAgingSummaryData;
  meta: IAPAgingSummaryMeta;
  query: IAPAgingSummaryQuery;
  columns: any;
}
