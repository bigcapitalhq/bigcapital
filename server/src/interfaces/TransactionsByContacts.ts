import { INumberFormatQuery } from './FinancialStatements';

export interface ITransactionsByContactsAmount {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface ITransactionsByContactsTransaction {
  date: string|Date,
  credit: ITransactionsByContactsAmount;
  debit: ITransactionsByContactsAmount;
  accountName: string,
  runningBalance: ITransactionsByContactsAmount;
  currencyCode: string;
  referenceNumber: string;
  transactionNumber: string;
  createdAt: string|Date,
};

export interface ITransactionsByContactsContact {
  openingBalance: ITransactionsByContactsAmount,
  closingBalance: ITransactionsByContactsAmount,
  transactions: ITransactionsByContactsTransaction[],
}

export interface ITransactionsByContactsFilter {
  fromDate: Date;
  toDate: Date;
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;
  noneZero: boolean;
}
