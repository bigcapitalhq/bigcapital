import { Knex } from 'knex';
import { IDynamicListFilterDTO } from '@/interfaces/DynamicFilter';

export interface IAccountDTO {
  name: string;
  code: string;
  description: string;
  accountType: string;
  parentAccountId?: number;
  active: boolean;
  bankBalance?: number;
  accountMask?: string;
}

export interface IAccountCreateDTO extends IAccountDTO {
  currencyCode?: string;
  plaidAccountId?: string;
  plaidItemId?: string;
}

export interface IAccountEditDTO extends IAccountDTO {}

export interface IAccount {
  id: number;
  name: string;
  slug: string;
  code: string;
  index: number;
  description: string;
  accountType: string;
  parentAccountId: number;
  active: boolean;
  predefined: boolean;
  amount: number;
  currencyCode: string;
  transactions?: any[];
  type?: any[];
  accountNormal: string;
  accountParentType: string;
  bankBalance: string;
  plaidItemId: number | null
  lastFeedsUpdatedAt: Date;
}

export enum AccountNormal {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export interface IAccountsTransactionsFilter {
  accountId?: number;
  limit?: number;
}

export interface IAccountTransaction {
  id?: number;

  credit: number;
  debit: number;
  currencyCode: string;
  exchangeRate: number;

  accountId: number;
  contactId?: number | null;
  date: string | Date;

  referenceType: string;
  referenceTypeFormatted: string;
  referenceId: number;

  referenceNumber?: string;

  transactionNumber?: string;
  transactionType?: string;

  note?: string;

  index: number;
  indexGroup?: number;

  costable?: boolean;

  userId?: number;
  itemId?: number;
  branchId?: number;
  projectId?: number;

  account?: IAccount;

  taxRateId?: number;
  taxRate?: number;
}
export interface IAccountResponse extends IAccount {}

export enum IAccountsStructureType {
  Tree = 'tree',
  Flat = 'flat',
}

export interface IAccountsFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string;
  onlyInactive: boolean;
  structure?: IAccountsStructureType;
}

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
  getAccountsTypes(tenantId: number): Promise<IAccountType>;
}

export interface IAccountEventCreatingPayload {
  tenantId: number;
  accountDTO: any;
  trx: Knex.Transaction;
}
export interface IAccountEventCreatedPayload {
  tenantId: number;
  account: IAccount;
  accountId: number;
  trx: Knex.Transaction;
}

export interface IAccountEventEditedPayload {
  tenantId: number;
  account: IAccount;
  oldAccount: IAccount;
  trx: Knex.Transaction;
}

export interface IAccountEventDeletedPayload {
  tenantId: number;
  accountId: number;
  oldAccount: IAccount;
  trx: Knex.Transaction;
}

export interface IAccountEventDeletePayload {
  trx: Knex.Transaction;
  oldAccount: IAccount;
  tenantId: number;
}

export interface IAccountEventActivatedPayload {
  tenantId: number;
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
