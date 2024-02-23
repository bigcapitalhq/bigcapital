import { IFinancialSheetCommonMeta } from './FinancialStatements';
import { IJournalEntry } from './Journal';
import { IFinancialTable } from './Table';

export interface IJournalReportQuery {
  fromDate: Date | string;
  toDate: Date | string;
  numberFormat: {
    noCents: boolean;
    divideOn1000: boolean;
  };
  transactionType: string;
  transactionId: string;

  accountsIds: number | number[];
  fromRange: number;
  toRange: number;
}

export interface IJournalReportEntriesGroup {
  id: string;
  date: Date;
  dateFormatted: string;
  entries: IJournalEntry[];
  currencyCode: string;
  credit: number;
  debit: number;
  formattedCredit: string;
  formattedDebit: string;
}

export interface IJournalReport {
  entries: IJournalReportEntriesGroup[];
}

export interface IJournalSheetMeta extends IFinancialSheetCommonMeta {
  formattedDateRange: string;
  formattedFromDate: string;
  formattedToDate: string;
}

export interface IJournalTable extends IFinancialTable {
  query: IJournalReportQuery;
  meta: IJournalSheetMeta;
}

export type IJournalTableData = IJournalReportEntriesGroup[];

export interface IJournalSheet {
  data: IJournalTableData;
  query: IJournalReportQuery;
  meta: IJournalSheetMeta;
}
