
import { IFilterRole } from "./DynamicFilter";

// ----------------------------------
export interface IContactAddress {
  billingAddress1: string,
  billingAddress2: string,
  billingAddressCity: string,
  billingAddressCountry: string,
  billingAddressEmail: string,
  billingAddressZipcode: string,
  billingAddressPhone: string,
  billingAddressState: string,

  shippingAddress1: string,
  shippingAddress2: string,
  shippingAddressCity: string,
  shippingAddressCountry: string,
  shippingAddressEmail: string,
  shippingAddressZipcode: string,
  shippingAddressPhone: string,
  shippingAddressState: string,
}
export interface IContactAddressDTO {
  billingAddress1?: string,
  billingAddress2?: string,
  billingAddressCity?: string,
  billingAddressCountry?: string,
  billingAddressEmail?: string,
  billingAddressZipcode?: string,
  billingAddressPhone?: string,
  billingAddressState?: string,

  shippingAddress1?: string,
  shippingAddress2?: string,
  shippingAddressCity?: string,
  shippingAddressCountry?: string,
  shippingAddressEmail?: string,
  shippingAddressZipcode?: string,
  shippingAddressPhone?: string,
  shippingAddressState?: string,
};
export interface IContact extends IContactAddress{
  id?: number,
  contactService: 'customer' | 'vendor',
  contactType: string,

  balance: number,
  currencyCode: string,

  openingBalance: number,
  openingBalanceAt: Date,

  salutation: string,
  firstName: string,
  lastName: string,
  companyName: string,
  displayName: string,

  email: string,
  website: string,
  workPhone: string,
  personalPhone: string,

  note: string,
  active: boolean,
}
export interface IContactNewDTO {
  contactType?: string,

  currencyCode?: string,

  openingBalance?: number,
  openingBalanceAt?: string,

  salutation?: string,
  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

  website?: string,
  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active: boolean,
}
export interface IContactEditDTO {
  contactType?: string,

  salutation?: string,
  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

  website?: string,
  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active: boolean, 
}

// Customer Interfaces.
// ----------------------------------
export interface ICustomer extends IContact {
  contactService: 'customer',
}
export interface ICustomerNewDTO extends IContactAddressDTO {
  customerType: string,

  currencyCode: string,

  openingBalance?: number,
  openingBalanceAt?: string,

  salutation?: string,
  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

  website?: string,
  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active?: boolean, 
};
export interface ICustomerEditDTO extends IContactAddressDTO {
  customerType: string,

  salutation?: string,
  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

  website?: string,
  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active?: boolean, 
};

// Vendor Interfaces.
// ----------------------------------
export interface IVendor extends IContact {
  contactService: 'vendor',
}
export interface IVendorNewDTO extends IContactAddressDTO {
  currencyCode: string,

  openingBalance?: number,
  openingBalanceAt?: string,

  salutation?: string,
  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

  website?: string,
  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active?: boolean, 
};
export interface IVendorEditDTO extends IContactAddressDTO {
  salutation?: string,
  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName?: string,

  website?: string,
  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active?: boolean, 
};

export interface IVendorsFilter extends IDynamicListFilter {
  stringifiedFilterRoles?: string,
  page?: number,
  pageSize?: number,
};

export interface ICustomersFilter extends IDynamicListFilter {
  stringifiedFilterRoles?: string,
  page?: number,
  pageSize?: number,
};

export interface IContactsAutoCompleteFilter {
  limit: number,
  keyword: string,
  filterRoles?: IFilterRole[];
  columnSortBy: string;
  sortOrder: string;
}

export interface IContactAutoCompleteItem {
  displayName: string,
  contactService: string,
}