// Vendor Interfaces.

import { Knex } from 'knex';
import { Vendor } from '../models/Vendor';
import { IContactAddressDTO } from '@/modules/Contacts/types/Contacts.types';

// ----------------------------------
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

// export interface IVendorsFilter extends IDynamicListFilter {
//   stringifiedFilterRoles?: string;
//   page?: number;
//   pageSize?: number;
// }

// Vendor Events.
// ----------------------------------
export interface IVendorEventCreatingPayload {
  // tenantId: number;
  vendorDTO: IVendorNewDTO;
  // authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export interface IVendorEventCreatedPayload {
  // tenantId: number;
  vendorId: number;
  vendor: Vendor;
  // authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export interface IVendorEventDeletingPayload {
  // tenantId: number;
  vendorId: number;
  oldVendor: Vendor;
}

export interface IVendorEventDeletedPayload {
  // tenantId: number;
  vendorId: number;
  // authorizedUser: ISystemUser;
  oldVendor: Vendor;
  trx?: Knex.Transaction;
}
export interface IVendorEventEditingPayload {
  // tenantId: number;
  vendorDTO: IVendorEditDTO;
  trx?: Knex.Transaction;
}
export interface IVendorEventEditedPayload {
  // tenantId: number;
  vendorId: number;
  vendor: Vendor;
  // authorizedUser: ISystemUser;
  trx?: Knex.Transaction;
}

export interface IVendorOpeningBalanceEditDTO {
  openingBalance: number;
  openingBalanceAt: Date | string;
  openingBalanceExchangeRate: number;
  openingBalanceBranchId?: number;
}

export interface IVendorOpeningBalanceEditingPayload {
  // tenantId: number;
  oldVendor: Vendor;
  openingBalanceEditDTO: IVendorOpeningBalanceEditDTO;
  trx?: Knex.Transaction;
}

export interface IVendorOpeningBalanceEditedPayload {
  // tenantId: number;
  vendor: Vendor;
  oldVendor: Vendor;
  openingBalanceEditDTO: IVendorOpeningBalanceEditDTO;
  trx: Knex.Transaction;
}

export interface IVendorActivatingPayload {
  // tenantId: number;
  oldVendor: Vendor;
  trx: Knex.Transaction;
}

export interface IVendorActivatedPayload {
  // tenantId: number;
  vendor: Vendor;
  oldVendor: Vendor;
  trx?: Knex.Transaction;
}
