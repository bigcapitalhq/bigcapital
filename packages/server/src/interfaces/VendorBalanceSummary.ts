import {
  IFinancialSheetCommonMeta,
  INumberFormatQuery,
} from './FinancialStatements';
import { IFinancialTable } from './Table';

export interface IVendorBalanceSummaryQuery {
  asDate: Date;
  vendorsIds: number[];
  numberFormat: INumberFormatQuery;
  percentageColumn: boolean;
  noneTransactions: boolean;
  noneZero: boolean;
}

export interface IVendorBalanceSummaryAmount {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}
export interface IVendorBalanceSummaryPercentage {
  amount: number;
  formattedAmount: string;
}

export interface IVendorBalanceSummaryVendor {
  id: number;
  vendorName: string;
  total: IVendorBalanceSummaryAmount;
  percentageOfColumn?: IVendorBalanceSummaryPercentage;
}

export interface IVendorBalanceSummaryTotal {
  total: IVendorBalanceSummaryAmount;
  percentageOfColumn?: IVendorBalanceSummaryPercentage;
}

export interface IVendorBalanceSummaryData {
  vendors: IVendorBalanceSummaryVendor[];
  total: IVendorBalanceSummaryTotal;
}

export interface IVendorBalanceSummaryStatement {
  data: IVendorBalanceSummaryData;
  query: IVendorBalanceSummaryQuery;
  meta: IVendorBalanceSummaryMeta;
  
}

export interface IVendorBalanceSummaryService {
  vendorBalanceSummary(
    tenantId: number,
    query: IVendorBalanceSummaryQuery
  ): Promise<IVendorBalanceSummaryStatement>;
}

export interface IVendorBalanceSummaryTable extends IFinancialTable {
  query: IVendorBalanceSummaryQuery;
  meta: IVendorBalanceSummaryMeta;
}

export interface IVendorBalanceSummaryMeta extends IFinancialSheetCommonMeta {
  formattedAsDate: string;
}
