import { Knex } from 'knex';
import { Customer } from '../models/Customer';
import { IContactAddressDTO } from '@/modules/Contacts/types/Contacts.types';
import { IDynamicListFilter } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';

// Customer Interfaces.
// ----------------------------------
export interface ICustomerNewDTO extends IContactAddressDTO {
  customerType: string;

  currencyCode: string;

  openingBalance?: number;
  openingBalanceAt?: string;
  openingBalanceExchangeRate?: number;
  openingBalanceBranchId?: number;

  salutation?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  displayName: string;

  website?: string;
  email?: string;
  workPhone?: string;
  personalPhone?: string;

  note?: string;
  active?: boolean;
}

export interface ICustomerEditDTO extends IContactAddressDTO {
  customerType: string;

  salutation?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  displayName: string;

  website?: string;
  email?: string;
  workPhone?: string;
  personalPhone?: string;

  note?: string;
  active?: boolean;
}

export interface ICustomersFilter extends IDynamicListFilter {
  stringifiedFilterRoles?: string;
  page?: number;
  pageSize?: number;
}

export interface GetCustomersResponse {
  customers: Customer[];
  pagination: IPaginationMeta;
  filterMeta: IFilterMeta;
}
// Customer Events.
// ----------------------------------
export interface ICustomerEventCreatedPayload {
  // tenantId: number;
  customerId: number;
  // authorizedUser: ISystemUser;
  customer: Customer;
  trx: Knex.Transaction;
}
export interface ICustomerEventCreatingPayload {
  // tenantId: number;
  customerDTO: ICustomerNewDTO;
  trx: Knex.Transaction;
}
export interface ICustomerEventEditedPayload {
  // tenantId: number
  customerId: number;
  customer: Customer;
  trx: Knex.Transaction;
}

export interface ICustomerEventEditingPayload {
  // tenantId: number;
  customerDTO: ICustomerEditDTO;
  customerId: number;
  trx: Knex.Transaction;
}

export interface ICustomerDeletingPayload {
  // tenantId: number;
  customerId: number;
  oldCustomer: Customer;
}

export interface ICustomerEventDeletedPayload {
  // tenantId: number;
  customerId: number;
  oldCustomer: Customer;
  trx: Knex.Transaction;
}
export interface ICustomerEventCreatingPayload {
  // tenantId: number;
  customerDTO: ICustomerNewDTO;
  trx: Knex.Transaction;
}
export enum CustomerAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
}

export enum VendorAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
}

export interface ICustomerOpeningBalanceEditDTO {
  openingBalance: number;
  openingBalanceAt: Date | string;
  openingBalanceExchangeRate: number;
  openingBalanceBranchId?: number;
}

export interface ICustomerOpeningBalanceEditingPayload {
  oldCustomer: Customer;
  openingBalanceEditDTO: ICustomerOpeningBalanceEditDTO;
  trx?: Knex.Transaction;
}

export interface ICustomerOpeningBalanceEditedPayload {
  customer: Customer;
  oldCustomer: Customer;
  openingBalanceEditDTO: ICustomerOpeningBalanceEditDTO;
  trx: Knex.Transaction;
}


export interface ICustomerActivatingPayload {
  // tenantId: number;
  trx: Knex.Transaction,
  oldCustomer: Customer;
}

export interface ICustomerActivatedPayload {
  // tenantId: number;
  trx?: Knex.Transaction;
  oldCustomer: Customer;
  customer: Customer;
}
