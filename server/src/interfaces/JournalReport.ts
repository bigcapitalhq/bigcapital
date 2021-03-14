import { IJournalEntry } from './Journal';

export interface IJournalReportQuery {
  fromDate: Date | string,
  toDate: Date | string,
  numberFormat: {
    noCents: boolean,
    divideOn1000: boolean,
  },
  transactionTypes: string | string[],
  accountsIds: number | number[],
  fromRange: number,
  toRange: number,
}

export interface IJournalReportEntriesGroup {
  id: string,
  entries: IJournalEntry[],
  currencyCode: string,
  credit: number,
  debit: number,
  formattedCredit: string,
  formattedDebit: string,
}

export interface IJournalReport {
  entries: IJournalReportEntriesGroup[],
}

export interface IJournalSheetMeta {
  isCostComputeRunning: boolean,
  organizationName: string,
  baseCurrency: string,
}