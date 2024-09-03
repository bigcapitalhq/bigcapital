import { ISystemUser } from '@/interfaces';
import { Knex } from 'knex';
import { IFilterRole } from './DynamicFilter';

export enum ContactService {
  Customer = 'customer',
  Vendor = 'vendor',
}

// ----------------------------------
export interface IContactAddress {
  billingAddress1: string;
  billingAddress2: string;
  billingAddressCity: string;
  billingAddressCountry: string;
  billingAddressEmail: string;
  billingAddressZipcode: string;
  billingAddressPhone: string;
  billingAddressState: string;

  shippingAddress1: string;
  shippingAddress2: string;
  shippingAddressCity: string;
  shippingAddressCountry: string;
  shippingAddressEmail: string;
  shippingAddressZipcode: string;
  shippingAddressPhone: string;
  shippingAddressState: string;
}
export interface IContactAddressDTO {
  billingAddress1?: string;
  billingAddress2?: string;
  billingAddressCity?: string;
  billingAddressCountry?: string;
  billingAddressEmail?: string;
  billingAddressZipcode?: string;
  billingAddressPhone?: string;
  billingAddressState?: string;

  shippingAddress1?: string;
  shippingAddress2?: string;
  shippingAddressCity?: string;
  shippingAddressCountry?: string;
  shippingAddressEmail?: string;
  shippingAddressZipcode?: string;
  shippingAddressPhone?: string;
  shippingAddressState?: string;
}
export interface IContact extends IContactAddress {
  id?: number;
  contactService: 'customer' | 'vendor';
  contactType: string;

  balance: number;
  currencyCode: string;

  openingBalance: number;
  openingBalanceExchangeRate: number;
  localOpeningBalance?: number;
  openingBalanceAt: Date;
  openingBalanceBranchId: number;

  salutation: string;
  firstName: string;
  lastName: string;
  companyName: string;
  displayName: string;

  email: string;
  website: string;
  workPhone: string;
  personalPhone: string;

  note: string;
  active: boolean;
}
export interface IContactNewDTO {
  contactType?: string;

  currencyCode?: string;

  openingBalance?: number;
  openingBalanceAt?: string;

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
  active: boolean;
}
export interface IContactEditDTO {
  contactType?: string;

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
  active: boolean;
}

// Customer Interfaces.
// ----------------------------------
export interface ICustomer extends IContact {
  contactService: 'customer';
}
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

// Vendor Interfaces.
// ----------------------------------
export interface IVendor extends IContact {
  contactService: 'vendor';
}
export interface IVendorNewDTO extends IContactAddressDTO {
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
export interface IVendorEditDTO extends IContactAddressDTO {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  displayName?: string;

  website?: string;
  email?: string;
  workPhone?: string;
  personalPhone?: string;

  note?: string;
  active?: boolean;
}

export interface IVendorsFilter extends IDynamicListFilter {
  stringifiedFilterRoles?: string;
  page?: number;
  pageSize?: number;
}

export interface ICustomersFilter extends IDynamicListFilter {
  stringifiedFilterRoles?: string;
  page?: number;
  pageSize?: number;
}

export interface IContactsAutoCompleteFilter {
  limit: number;
  keyword: string;
  filterRoles?: IFilterRole[];
  columnSortBy: string;
  sortOrder: string;
}

export interface IContactAutoCompleteItem {
  displayName: string;
  contactService: string;
}
export interface ICustomerEventCreatedPayload {
  tenantId: number;
  customerId: number;
  authorizedUser: ISystemUser;
  customer: ICustomer;
  trx: Knex.Transaction;
}
export interface ICustomerEventCreatingPayload {
  tenantId: number;
  customerDTO: ICustomerNewDTO;
  trx: Knex.Transaction;
}
export interface ICustomerEventEditedPayload {
  tenantId: number
  customerId: number;
  customer: ICustomer;
  trx: Knex.Transaction;
}

export interface ICustomerEventEditingPayload {
  tenantId: number;
  customerDTO: ICustomerEditDTO;
  customerId: number;
  trx: Knex.Transaction;
}

export interface ICustomerDeletingPayload {
  tenantId: number;
  customerId: number;
  oldCustomer: ICustomer;
}

export interface ICustomerEventDeletedPayload {
  tenantId: number;
  customerId: number;
  oldCustomer: ICustomer;
  authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}
export interface IVendorEventCreatingPayload {
  tenantId: number;
  vendorDTO: IVendorNewDTO;
  trx: Knex.Transaction;
}
export interface IVendorEventCreatedPayload {
  tenantId: number;
  vendorId: number;
  vendor: IVendor;
  authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export interface IVendorEventDeletingPayload {
  tenantId: number;
  vendorId: number;
  oldVendor: IVendor;
}

export interface IVendorEventDeletedPayload {
  tenantId: number;
  vendorId: number;
  authorizedUser: ISystemUser;
  oldVendor: IVendor;
  trx: Knex.Transaction;
}
export interface IVendorEventEditingPayload {
  trx: Knex.Transaction;
  tenantId: number;
  vendorDTO: IVendorEditDTO;
}
export interface IVendorEventEditedPayload {
  tenantId: number;
  vendorId: number;
  vendor: IVendor;
  authorizedUser: ISystemUser;
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
  tenantId: number;
  oldCustomer: ICustomer;
  openingBalanceEditDTO: ICustomerOpeningBalanceEditDTO;
  trx: Knex.Transaction;
}

export interface ICustomerOpeningBalanceEditedPayload {
  tenantId: number;
  customer: ICustomer;
  oldCustomer: ICustomer;
  openingBalanceEditDTO: ICustomerOpeningBalanceEditDTO;
  trx: Knex.Transaction;
}

export interface IVendorOpeningBalanceEditDTO {
  openingBalance: number;
  openingBalanceAt: Date | string;
  openingBalanceExchangeRate: number;
  openingBalanceBranchId?: number;
}

export interface IVendorOpeningBalanceEditingPayload {
  tenantId: number;
  oldVendor: IVendor;
  openingBalanceEditDTO: IVendorOpeningBalanceEditDTO;
  trx: Knex.Transaction;
}

export interface IVendorOpeningBalanceEditedPayload {
  tenantId: number;
  vendor: IVendor;
  oldVendor: IVendor;
  openingBalanceEditDTO: IVendorOpeningBalanceEditDTO;
  trx: Knex.Transaction;
}


export interface ICustomerActivatingPayload {
  tenantId: number;
  trx: Knex.Transaction,
  oldCustomer: IContact;
}

export interface ICustomerActivatedPayload {
  tenantId: number;
  trx: Knex.Transaction,
  oldCustomer: IContact; 
  customer: IContact;
}

export interface IVendorActivatingPayload {
  tenantId: number;
  trx: Knex.Transaction,
  oldVendor: IContact;
}

export interface IVendorActivatedPayload {
  tenantId: number;
  trx: Knex.Transaction,
  oldVendor: IContact; 
  vendor: IContact;
}