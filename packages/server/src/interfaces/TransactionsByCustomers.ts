import { IFinancialSheetCommonMeta } from './FinancialStatements';
import { IFinancialTable, ITableData } from './Table';
import {
  ITransactionsByContactsAmount,
  ITransactionsByContactsTransaction,
  ITransactionsByContactsFilter,
} from './TransactionsByContacts';

export interface ITransactionsByCustomersAmount
  extends ITransactionsByContactsAmount {}

export interface ITransactionsByCustomersTransaction
  extends ITransactionsByContactsTransaction {}

export interface ITransactionsByCustomersCustomer {
  customerName: string;
  openingBalance: ITransactionsByCustomersAmount;
  closingBalance: ITransactionsByCustomersAmount;
  transactions: ITransactionsByCustomersTransaction[];
}

export interface ITransactionsByCustomersFilter
  extends ITransactionsByContactsFilter {
  customersIds: number[];
}

export type ITransactionsByCustomersData = ITransactionsByCustomersCustomer[];

export interface ITransactionsByCustomersStatement {
  data: ITransactionsByCustomersData;
  query: ITransactionsByCustomersFilter;
  meta: ITransactionsByCustomersMeta;
}

export interface ITransactionsByCustomersTable extends IFinancialTable {
  query: ITransactionsByCustomersFilter;
  meta: ITransactionsByCustomersMeta;
}

export interface ITransactionsByCustomersService {
  transactionsByCustomers(
    tenantId: number,
    filter: ITransactionsByCustomersFilter
  ): Promise<ITransactionsByCustomersStatement>;
}
export interface ITransactionsByCustomersMeta
  extends IFinancialSheetCommonMeta {
  formattedFromDate: string;
  formattedToDate: string;
  formattedDateRange: string;
}
