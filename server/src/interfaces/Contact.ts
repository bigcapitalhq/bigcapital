
// Contact Interfaces.
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
  contactService: 'customer' | 'vendor',
  contactType: string,

  balance: number,
  openingBalance: number,

  firstName: string,
  lastName: string,
  companyName: string,
  displayName: string,

  email: string,
  workPhone: string,
  personalPhone: string,

  note: string,
  active: boolean,
}
export interface IContactNewDTO {
  contactType?: string,

  openingBalance?: number,

  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active: boolean, 
}
export interface IContactEditDTO {
  contactType?: string,

  openingBalance?: number,

  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

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

  openingBalance?: number,

  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active?: boolean, 
};
export interface ICustomerEditDTO extends IContactAddressDTO {
  customerType: string,

  openingBalance?: number,

  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

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
  openingBalance?: number,

  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName: string,

  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active?: boolean, 
};
export interface IVendorEditDTO extends IContactAddressDTO {
  openingBalance?: number,

  firstName?: string,
  lastName?: string,
  companyName?: string,
  displayName?: string,

  email?: string,
  workPhone?: string,
  personalPhone?: string,

  note?: string,
  active?: boolean, 
};