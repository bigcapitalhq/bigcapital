import { INumberFormatQuery } from './FinancialStatements';

export interface IVendorBalanceSummaryQuery {
  asDate: Date;
  numberFormat: INumberFormatQuery;
  comparison: {
    percentageOfColumn: boolean;
  };
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
  columns: {};
  query: IVendorBalanceSummaryQuery;
}

export interface IVendorBalanceSummaryService {
  vendorBalanceSummary(
    tenantId: number,
    query: IVendorBalanceSummaryQuery,
  ): Promise<IVendorBalanceSummaryStatement>;
}
