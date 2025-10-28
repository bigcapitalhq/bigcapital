import { Knex } from 'knex';
import * as moment from 'moment';

export interface ILedger {
  entries: ILedgerEntry[];

  getEntries(): ILedgerEntry[];

  filter(cb: (entry: ILedgerEntry) => boolean): ILedger;

  whereAccountId(accountId: number): ILedger;
  whereAccountsIds(accountsIds: number[]): ILedger;
  whereContactId(contactId: number): ILedger;
  whereFromDate(fromDate: Date | string): ILedger;
  whereToDate(toDate: Date | string): ILedger;
  whereCurrencyCode(currencyCode: string): ILedger;
  whereBranch(branchId: number): ILedger;
  whereItem(itemId: number): ILedger;
  whereProject(projectId: number): ILedger;

  getClosingBalance(): number;
  getForeignClosingBalance(): number;
  getClosingDebit(): number;
  getClosingCredit(): number;

  getContactsIds(): number[];
  getAccountsIds(): number[];

  reverse(): ILedger;
  isEmpty(): boolean;
}

export interface ILedgerEntry {
  id?: number;

  credit: number;
  debit: number;

  currencyCode: string;
  exchangeRate: number;

  accountId?: number;
  accountNormal: string;
  contactId?: number;
  date: moment.MomentInput;

  transactionType: string;
  transactionSubType?: string;

  transactionId: number;

  transactionNumber?: string;

  referenceNumber?: string;
  index: number;
  indexGroup?: number;

  note?: string;

  userId?: number;
  itemId?: number;
  branchId?: number;
  projectId?: number;

  taxRateId?: number;
  taxRate?: number;

  entryId?: number;
  createdAt?: Date | string;

  costable?: boolean;
}

export interface ISaveLedgerEntryQueuePayload {
  tenantId: number;
  entry: ILedgerEntry;
  trx?: Knex.Transaction;
}

export interface ISaveAccountsBalanceQueuePayload {
  ledger: ILedger;
  tenantId: number;
  accountId: number;
  trx?: Knex.Transaction;
}

export interface ISaleContactsBalanceQueuePayload {
  ledger: ILedger;
  tenantId: number;
  contactId: number;
  trx?: Knex.Transaction;
}
