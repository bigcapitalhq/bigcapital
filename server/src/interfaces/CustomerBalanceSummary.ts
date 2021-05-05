import { INumberFormatQuery } from './FinancialStatements';

export interface ICustomerBalanceSummaryQuery {
  asDate: Date;
  numberFormat: INumberFormatQuery;
  comparison: {
    percentageOfColumn: boolean;
  };
  noneTransactions: boolean;
  noneZero: boolean;
}

export interface ICustomerBalanceSummaryAmount {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}
export interface ICustomerBalanceSummaryPercentage {
  amount: number;
  formattedAmount: string;
}

export interface ICustomerBalanceSummaryCustomer {
  customerName: string;
  total: ICustomerBalanceSummaryAmount;
  percentageOfColumn?: ICustomerBalanceSummaryPercentage;
}

export interface ICustomerBalanceSummaryTotal {
  total: ICustomerBalanceSummaryAmount;
  percentageOfColumn?: ICustomerBalanceSummaryPercentage;
}

export interface ICustomerBalanceSummaryData {
  customers: ICustomerBalanceSummaryCustomer[];
  total: ICustomerBalanceSummaryTotal;
}

export interface ICustomerBalanceSummaryStatement {
  data: ICustomerBalanceSummaryData;
  columns: {};
  query: ICustomerBalanceSummaryQuery;
}

export interface ICustomerBalanceSummaryService {
  customerBalanceSummary(
    tenantId: number,
    query: ICustomerBalanceSummaryQuery,
  ): Promise<ICustomerBalanceSummaryStatement>;
}
