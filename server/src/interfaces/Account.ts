import { IDynamicListFilterDTO } from 'interfaces/DynamicFilter';

export interface IAccountDTO {
  name: string,
  code: string,
  description: string,
  accountTypeNumber: number,
};

export interface IAccount {
  name: string,
  code: string,
  description: string,
  accountTypeNumber: number,
};

export interface IAccountsFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string,
};
