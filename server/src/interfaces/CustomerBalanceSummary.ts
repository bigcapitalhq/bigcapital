import { INumberFormatQuery } from './FinancialStatements';

import {
  IContactBalanceSummaryQuery,
  IContactBalanceSummaryAmount,
  IContactBalanceSummaryPercentage,
  IContactBalanceSummaryTotal
} from './ContactBalanceSummary';

export interface ICustomerBalanceSummaryQuery
  extends IContactBalanceSummaryQuery {}

export interface ICustomerBalanceSummaryAmount
  extends IContactBalanceSummaryAmount {}

export interface ICustomerBalanceSummaryPercentage
  extends IContactBalanceSummaryPercentage {}

export interface ICustomerBalanceSummaryCustomer {
  customerName: string;
  total: ICustomerBalanceSummaryAmount;
  percentageOfColumn?: ICustomerBalanceSummaryPercentage;
}

export interface ICustomerBalanceSummaryTotal extends IContactBalanceSummaryTotal {
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
    query: ICustomerBalanceSummaryQuery
  ): Promise<ICustomerBalanceSummaryStatement>;
}
