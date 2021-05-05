import { INumberFormatQuery } from './FinancialStatements';

export interface ITransactionsByCustomersAmount {
  amount: number;
  formattedAmount: string;
}

export interface ITransactionsByCustomersTransaction {
  date: string|Date,
  credit: ITransactionsByCustomersAmount;
  debit: ITransactionsByCustomersAmount;
  runningBalance: ITransactionsByCustomersAmount;
  referenceNumber: string;
  transactionNumber: string;
}

export interface ITransactionsByCustomersCustomer {
  customerName: string;
  openingBalance: any;
  closingBalance: any;
  transactions: ITransactionsByCustomersTransaction[];
}

export interface ITransactionsByCustomersFilter {
  fromDate: Date;
  toDate: Date;
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;
  noneZero: boolean;
}

export interface ITransactionsByCustomersData {
  customers: ITransactionsByCustomersCustomer[];
}

export interface ITransactionsByCustomersStatement {
  data: ITransactionsByCustomersData;
}

export interface ITransactionsByCustomersService {
  transactionsByCustomers(
    tenantId: number,
    filter: ITransactionsByCustomersFilter
  ): Promise<ITransactionsByCustomersStatement>;
}
