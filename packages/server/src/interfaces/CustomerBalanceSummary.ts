import {
  IContactBalanceSummaryQuery,
  IContactBalanceSummaryAmount,
  IContactBalanceSummaryPercentage,
  IContactBalanceSummaryTotal,
} from './ContactBalanceSummary';
import { IFinancialSheetCommonMeta } from './FinancialStatements';
import { IFinancialTable } from './Table';

export interface ICustomerBalanceSummaryQuery
  extends IContactBalanceSummaryQuery {
  customersIds?: number[];
}

export interface ICustomerBalanceSummaryAmount
  extends IContactBalanceSummaryAmount {}

export interface ICustomerBalanceSummaryPercentage
  extends IContactBalanceSummaryPercentage {}

export interface ICustomerBalanceSummaryCustomer {
  id: number;
  customerName: string;
  total: ICustomerBalanceSummaryAmount;
  percentageOfColumn?: ICustomerBalanceSummaryPercentage;
}

export interface ICustomerBalanceSummaryTotal
  extends IContactBalanceSummaryTotal {
  total: ICustomerBalanceSummaryAmount;
  percentageOfColumn?: ICustomerBalanceSummaryPercentage;
}

export interface ICustomerBalanceSummaryData {
  customers: ICustomerBalanceSummaryCustomer[];
  total: ICustomerBalanceSummaryTotal;
}

export interface ICustomerBalanceSummaryMeta extends IFinancialSheetCommonMeta {
  formattedAsDate: string;
  formattedDateRange: string;
}

export interface ICustomerBalanceSummaryStatement {
  data: ICustomerBalanceSummaryData;
  query: ICustomerBalanceSummaryQuery;
  meta: ICustomerBalanceSummaryMeta;
}

export interface ICustomerBalanceSummaryService {
  customerBalanceSummary(
    tenantId: number,
    query: ICustomerBalanceSummaryQuery
  ): Promise<ICustomerBalanceSummaryStatement>;
}

export interface ICustomerBalanceSummaryTable extends IFinancialTable {
  query: ICustomerBalanceSummaryQuery;
  meta: ICustomerBalanceSummaryMeta;
}
