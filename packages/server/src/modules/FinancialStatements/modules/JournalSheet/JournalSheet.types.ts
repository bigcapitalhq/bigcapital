import { IFinancialSheetCommonMeta } from '../../types/Report.types';
import { IFinancialTable } from '../../types/Table.types';

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

export interface IJournalSheetEntry {
  entryId: number;
  index: number;

  credit: number;
  debit: number;

  formattedDebit: string;
  formattedCredit: string;

  contactType: string;
  contactName: string;

  currencyCode: string;

  accountName: string;
  accountCode: string;
  transactionNumber: string;

  note: string;
  createdAt: Date | string;
}

export interface IJournalReportEntriesGroup {
  date: Date;
  dateFormatted: string;

  entries: IJournalSheetEntry[];
  currencyCode: string;

  credit: number;
  debit: number;

  formattedCredit: string;
  formattedDebit: string;

  transactionType: string;

  referenceId: number;
  referenceTypeFormatted: string;
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
