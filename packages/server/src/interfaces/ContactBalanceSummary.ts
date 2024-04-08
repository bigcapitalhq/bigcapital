import { INumberFormatQuery } from './FinancialStatements';

export interface IContactBalanceSummaryQuery {
  asDate: Date;
  numberFormat: INumberFormatQuery;
  percentageColumn: boolean;
  noneTransactions: boolean;
  noneZero: boolean;
}

export interface IContactBalanceSummaryAmount {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}
export interface IContactBalanceSummaryPercentage {
  amount: number;
  formattedAmount: string;
}

export interface IContactBalanceSummaryContact {
  total: IContactBalanceSummaryAmount;
  percentageOfColumn?: IContactBalanceSummaryPercentage;
}

export interface IContactBalanceSummaryTotal {
  total: IContactBalanceSummaryAmount;
  percentageOfColumn?: IContactBalanceSummaryPercentage;
}

export interface ICustomerBalanceSummaryDataDupe {
  customers: IContactBalanceSummaryContact[];
  total: IContactBalanceSummaryTotal;
}

export interface ICustomerBalanceSummaryStatementDupe {
  data: ICustomerBalanceSummaryDataDupe;
  columns: {};
  query: IContactBalanceSummaryQuery;
}

export interface ICustomerBalanceSummaryServiceDupe {
  customerBalanceSummary(
    tenantId: number,
    query: IContactBalanceSummaryQuery,
  ): Promise<ICustomerBalanceSummaryStatementDupe>;
}
