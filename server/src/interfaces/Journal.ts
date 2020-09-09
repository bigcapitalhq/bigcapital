

export interface IJournalEntry {
  index?: number,

  date: Date,
  credit: number,
  debit: number,
  account: number,
  referenceType: string,
  referenceId: number,

  transactionType?: string,
  note?: string,
  userId?: number,
  contactType?: string,
  contactId?: number,
};

export interface IJournalPoster {
  credit(entry: IJournalEntry): void;
  debit(entry: IJournalEntry): void;

  removeEntries(ids: number[]): void;

  saveEntries(): void;
  saveBalance(): void;
  deleteEntries(): void; 
}

export type TEntryType = 'credit' | 'debit';

export interface IAccountChange {
  credit: number,
  debit: number,
};

export interface IAccountsChange {
  [key: string]: IAccountChange,
};
