import { IDynamicListFilterDTO } from 'interfaces/DynamicFilter';

export interface IAccountDTO {
  name: string,
  code: string,
  description: string,
  accountType: string,
  parentAccountId: number,
  active: boolean,
};

export interface IAccount {
  id: number,
  name: string,
  slug: string,
  code: string,
  index: number,
  description: string,
  accountType: string,
  parentAccountId: number,
  active: boolean,
  predefined: boolean,
  amount: number,
  currencyCode: string,
  transactions?: any[],
  type?: any[],
  accountNormal: string,
  accountParentType: string,
};

export interface IAccountsTransactionsFilter {
  accountId?: number,
}

export interface IAccountTransaction {
  credit: number;
  debit: number;
  accountId: number;
  contactId: number;
  date: string|Date;
  referenceNumber: string;
  account: IAccount;
}
export interface IAccountResponse extends IAccount {
  
}

export interface IAccountsFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string,
};

export interface IAccountType {
  label: string,
  key: string,
  label: string,
  normal: string,
  rootType: string,
  childType: string,
  balanceSheet: boolean,
  incomeSheet: boolean,
}

export interface IAccountsTypesService {
  getAccountsTypes(tenantId: number): Promise<IAccountType>;
}