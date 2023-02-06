export interface IJournalEntry {
  id: number;
  index?: number;

  date: Date;
  credit: number;
  debit: number;
  account: number;
  referenceType: string;
  referenceId: number;

  referenceTypeFormatted: string;

  itemId?: number;
  transactionNumber?: string;
  referenceNumber?: string;

  transactionType?: string;
  note?: string;
  userId?: number;
  contactType?: string;
  contactId?: number;
  branchId: number;
}

export interface IJournalPoster {
  entries: IJournalEntry[];

  credit(entry: IJournalEntry): void;
  debit(entry: IJournalEntry): void;

  removeEntries(ids: number[]): void;

  saveEntries(): void;
  saveBalance(): void;
  deleteEntries(): void;

  getAccountBalance(
    accountId: number,
    closingDate?: Date | string,
    dateType?: string
  ): number;
  getAccountEntries(accountId: number): IJournalEntry[];
}

export type TEntryType = 'credit' | 'debit';

export interface IAccountChange {
  credit: number;
  debit: number;
}

export interface IAccountsChange {
  [key: string]: IAccountChange;
}
