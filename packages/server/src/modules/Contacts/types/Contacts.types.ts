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

// export interface IContactsAutoCompleteFilter {
//   limit: number;
//   keyword: string;
//   filterRoles?: IFilterRole[];
//   columnSortBy: string;
//   sortOrder: string;
// }

export interface IContactAutoCompleteItem {
  displayName: string;
  contactService: string;
}
