export interface ILedger {
  entries: ILedgerEntry[];

  getEntries(): ILedgerEntry[];
  whereAccountId(accountId: number): ILedger;
  whereContactId(contactId: number): ILedger;
  whereFromDate(fromDate: Date | string): ILedger;
  whereToDate(toDate: Date | string): ILedger;
  getClosingBalance(): number;
}

export interface ILedgerEntry {
  credit: number;
  debit: number;
  accountId?: number;
  accountNormal: string;
  contactId?: number;
  date: Date | string;
  transactionType?: string,
  transactionNumber?: string,
}
