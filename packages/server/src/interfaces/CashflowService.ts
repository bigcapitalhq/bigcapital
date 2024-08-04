import { Knex } from 'knex';
import { IAccount } from './Account';
import { IUncategorizedCashflowTransaction } from './CashFlow';

export interface ICashflowAccountTransactionsFilter {
  page: number;
  pageSize: number;
}

export interface ICashflowAccountsFilter {
  inactiveMode: boolean;
  stringifiedFilterRoles?: string;
  sortOrder: string;
  columnSortBy: string;
}

export interface ICashflowAccount {
  id: number;
  name: string;
  balance: number;
  formattedBalance: string;
  accountType: string;
}

interface ICashflowCommandLineDTO {
  creditAccountId: number;
  cashflowAccountId: number;
  amount: number;
  index: number;
}

export interface ICashflowCommandDTO {
  date: Date;

  transactionNumber: string;
  referenceNo: string;
  transactionType: string;
  description: string;

  amount: number;
  exchangeRate: number;
  currencyCode: string;

  creditAccountId: number;
  cashflowAccountId: number;

  publish: boolean;
  branchId?: number;
  plaidTransactionId?: string;
}

export interface ICashflowNewCommandDTO extends ICashflowCommandDTO {
  plaidAccountId?: string;
  uncategorizedTransactionId?: number;
}

export interface ICashflowTransaction {
  id?: number;
  date: Date;

  referenceNo: string;
  description: string;

  transactionType: string;
  transactionNumber: string;

  amount: number;
  localAmount?: number;
  currencyCode: string;
  exchangeRate: number;

  publishedAt?: Date | null;
  userId: number;
  entries: ICashflowTransactionLine[];

  creditAccountId: number;
  cashflowAccountId: number;

  creditAccount?: IAccount;
  cashflowAccount?: IAccount;

  branchId?: number;
  isPublished: boolean;

  isCashDebit?: boolean;
  isCashCredit?: boolean;

  uncategorizedTransactionId?: number;
}

export interface ICashflowTransactionLine {
  creditAccountId: number;
  cashflowAccountId: number;
  amount: number;
  index: number;

  creditAccount?: IAccount;
}

export enum CashflowDirection {
  IN = 'in',
  OUT = 'out',
}

export interface ICommandCashflowCreatingPayload {
  tenantId: number;
  trx: Knex.Transaction;
  newTransactionDTO: ICashflowNewCommandDTO;
}

export interface ICommandCashflowCreatedPayload {
  tenantId: number;
  newTransactionDTO: ICashflowNewCommandDTO;
  cashflowTransaction: ICashflowTransaction;
  trx: Knex.Transaction;
}

export interface ICommandCashflowDeletingPayload {
  tenantId: number;
  oldCashflowTransaction: ICashflowTransaction;
  trx: Knex.Transaction;
}

export interface ICommandCashflowDeletedPayload {
  tenantId: number;
  cashflowTransactionId: number;
  oldCashflowTransaction: ICashflowTransaction;
  trx: Knex.Transaction;
}

export interface ICashflowTransactionCategorizedPayload {
  tenantId: number;
  uncategorizedTransactions: Array<IUncategorizedCashflowTransaction>;
  cashflowTransaction: ICashflowTransaction;
  oldUncategorizedTransactions: Array<IUncategorizedCashflowTransaction>;
  categorizeDTO: any;
  trx: Knex.Transaction;
}
export interface ICashflowTransactionUncategorizingPayload {
  tenantId: number;
  uncategorizedTransactionId: number;
  oldUncategorizedTransactions: Array<IUncategorizedCashflowTransaction>;
  trx: Knex.Transaction;
}
export interface ICashflowTransactionUncategorizedPayload {
  tenantId: number;
  uncategorizedTransactionId: number;
  uncategorizedTransactions: Array<IUncategorizedCashflowTransaction>;
  oldUncategorizedTransactions: Array<IUncategorizedCashflowTransaction>;
  trx: Knex.Transaction;
}

export enum CashflowAction {
  Create = 'Create',
  Delete = 'Delete',
  View = 'View',
}

export interface CategorizeTransactionAsExpenseDTO {
  expenseAccountId: number;
  exchangeRate: number;
  referenceNo: string;
  description: string;
  branchId?: number;
}

export interface IGetUncategorizedTransactionsQuery {
  page?: number;
  pageSize?: number;
}


export interface IGetRecognizedTransactionsQuery {
  page?: number;
  pageSize?: number;
  accountId?: number;
}