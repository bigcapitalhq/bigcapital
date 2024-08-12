import { IFinancialSheetCommonMeta } from './FinancialStatements';
import { IFinancialTable } from './Table';

export interface IGeneralLedgerSheetQuery {
  fromDate: Date | string;
  toDate: Date | string;
  basis: string;
  numberFormat: {
    noCents: boolean;
    divideOn1000: boolean;
  };
  noneTransactions: boolean;
  accountsIds: number[];
  branchesIds?: number[];
}

export interface IGeneralLedgerSheetAccountTransaction {
  id: number;

  amount: number;
  runningBalance: number;
  credit: number;
  debit: number;

  formattedAmount: string;
  formattedCredit: string;
  formattedDebit: string;
  formattedRunningBalance: string;

  currencyCode: string;
  note?: string;

  transactionTypeFormatted: string;
  transactionNumber: string;

  referenceId?: number;
  referenceType?: string;

  date: Date | string;
  dateFormatted: string;
}

export interface IGeneralLedgerSheetAccountBalance {
  date: Date | string;
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface IGeneralLedgerSheetAccount {
  id: number;
  name: string;
  code: string;
  index: number;
  parentAccountId: number;
  transactions: IGeneralLedgerSheetAccountTransaction[];
  openingBalance: IGeneralLedgerSheetAccountBalance;
  closingBalance: IGeneralLedgerSheetAccountBalance;
  closingBalanceSubaccounts?: IGeneralLedgerSheetAccountBalance;
  children?: IGeneralLedgerSheetAccount[];
}

export type IGeneralLedgerSheetData = IGeneralLedgerSheetAccount[];

export interface IAccountTransaction {
  id: number;
  index: number;
  draft: boolean;
  note: string;
  accountId: number;
  transactionType: string;
  referenceType: string;
  referenceId: number;
  contactId: number;
  contactType: string;
  credit: number;
  debit: number;
  date: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IGeneralLedgerMeta extends IFinancialSheetCommonMeta {
  formattedFromDate: string;
  formattedToDate: string;
  formattedDateRange: string;
}

export interface IGeneralLedgerTableData extends IFinancialTable {
  meta: IGeneralLedgerMeta;
  query: IGeneralLedgerSheetQuery;
}
