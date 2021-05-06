import { INumberFormatQuery } from './FinancialStatements';

export interface ITransactionsByCustomersAmount {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface ITransactionsByCustomersTransaction {
  date: string|Date,
  credit: ITransactionsByCustomersAmount;
  debit: ITransactionsByCustomersAmount;
  runningBalance: ITransactionsByCustomersAmount;
  currencyCode: string;
  referenceNumber: string;
  transactionNumber: string;
  createdAt: string|Date,
};

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

export type ITransactionsByCustomersData = ITransactionsByCustomersCustomer[];

export interface ITransactionsByCustomersStatement {
  data: ITransactionsByCustomersData;
}

export interface ITransactionsByCustomersService {
  transactionsByCustomers(
    tenantId: number,
    filter: ITransactionsByCustomersFilter
  ): Promise<ITransactionsByCustomersStatement>;
}
