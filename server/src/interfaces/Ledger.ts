export interface ILedger {
  entries: ILedgerEntry[];

  getEntries(): ILedgerEntry[];
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
}
