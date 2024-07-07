import { INumberFormatQuery } from '../../FinancialStatements';

export interface ICashflowAccountTransactionsQuery {
  page: number;
  pageSize: number;
  accountId: number;
  numberFormat: INumberFormatQuery;
}

export interface ICashflowAccountTransaction {
  withdrawal: number;
  deposit: number;
  runningBalance: number;

  formattedWithdrawal: string;
  formattedDeposit: string;
  formattedRunningBalance: string;

  transactionNumber: string;
  referenceNumber: string;

  referenceId: number;
  referenceType: string;

  formattedTransactionType: string;

  balance: number;
  formattedBalance: string;

  date: Date;
  formattedDate: string;

  status: string;
  formattedStatus: string;

  uncategorizedTransactionId: number;
}
