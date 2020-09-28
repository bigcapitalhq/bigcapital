import { IDynamicListFilterDTO } from 'interfaces/DynamicFilter';

export interface IAccountDTO {
  name: string,
  code: string,
  description: string,
  accountTypeId: number,
  parentAccountId: number,
  active: boolean,
};

export interface IAccount {
  name: string,
  slug: string,
  code: string,
  description: string,
  accountTypeId: number,
  parentAccountId: number,
  active: boolean,
  predefined: boolean,
  amount: number,
  currencyCode: string,
};

export interface IAccountsFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string,
};
