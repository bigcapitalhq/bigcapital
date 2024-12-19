import { Knex } from 'knex';
import { Account } from './models/Account.model';
// import { IDynamicListFilterDTO } from '@/interfaces/DynamicFilter';

export enum AccountNormal {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export interface IAccountsTransactionsFilter {
  accountId?: number;
  limit?: number;
}

export enum IAccountsStructureType {
  Tree = 'tree',
  Flat = 'flat',
}

// export interface IAccountsFilter extends IDynamicListFilterDTO {
//   stringifiedFilterRoles?: string;
//   onlyInactive: boolean;
//   structure?: IAccountsStructureType;
// }
export interface IAccountsFilter {}
export interface IAccountType {
  label: string;
  key: string;
  normal: string;
  rootType: string;
  childType: string;
  balanceSheet: boolean;
  incomeSheet: boolean;
}

export interface IAccountsTypesService {
  getAccountsTypes(): Promise<IAccountType>;
}

export interface IAccountEventCreatingPayload {
  accountDTO: any;
  trx: Knex.Transaction;
}
export interface IAccountEventCreatedPayload {
  account: Account;
  accountId: number;
  trx: Knex.Transaction;
}

export interface IAccountEventEditedPayload {
  account: Account;
  oldAccount: Account;
  trx: Knex.Transaction;
}

export interface IAccountEventDeletedPayload {
  accountId: number;
  oldAccount: Account;
  trx: Knex.Transaction;
}

export interface IAccountEventDeletePayload {
  trx: Knex.Transaction;
  oldAccount: Account;
}

export interface IAccountEventActivatedPayload {
  accountId: number;
  trx: Knex.Transaction;
}

export enum AccountAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  VIEW = 'View',
  TransactionsLocking = 'TransactionsLocking',
}

export enum TaxRateAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  VIEW = 'View',
}

export interface CreateAccountParams {
  ignoreUniqueName: boolean;
}


export interface IGetAccountTransactionPOJO {
  
}
