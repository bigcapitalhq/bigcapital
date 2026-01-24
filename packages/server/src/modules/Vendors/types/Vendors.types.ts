// Vendor Interfaces.

import { Knex } from 'knex';
import { Vendor } from '../models/Vendor';
import { IContactAddressDTO } from '@/modules/Contacts/types/Contacts.types';
import { IDynamicListFilter } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { CreateVendorDto } from '../dtos/CreateVendor.dto';
import { EditVendorDto } from '../dtos/EditVendor.dto';
import { VendorOpeningBalanceEditDto } from '../dtos/VendorOpeningBalanceEdit.dto';

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

export interface IVendorsFilter extends IDynamicListFilter {
  stringifiedFilterRoles?: string;
  page?: number;
  pageSize?: number;
}

export interface GetVendorsResponse {
  vendors: Vendor[];
  pagination: IPaginationMeta;
  filterMeta: IFilterMeta;
}

// Vendor Events.
// ----------------------------------
export interface IVendorEventCreatingPayload {
  vendorDTO: CreateVendorDto;
  trx: Knex.Transaction;
}

export interface IVendorEventCreatedPayload {
  vendorId: number;
  vendor: Vendor;
  trx: Knex.Transaction;
}

export interface IVendorEventDeletingPayload {
  vendorId: number;
  oldVendor: Vendor;
}

export interface IVendorEventDeletedPayload {
  vendorId: number;
  oldVendor: Vendor;
  trx?: Knex.Transaction;
}
export interface IVendorEventEditingPayload {
  vendorDTO: EditVendorDto;
  trx?: Knex.Transaction;
}
export interface IVendorEventEditedPayload {
  vendorId: number;
  vendor: Vendor;
  trx?: Knex.Transaction;
}

export interface IVendorOpeningBalanceEditingPayload {
  oldVendor: Vendor;
  openingBalanceEditDTO: VendorOpeningBalanceEditDto;
  trx?: Knex.Transaction;
}

export interface IVendorOpeningBalanceEditedPayload {
  vendor: Vendor;
  oldVendor: Vendor;
  openingBalanceEditDTO: VendorOpeningBalanceEditDto;
  trx: Knex.Transaction;
}

export interface IVendorActivatingPayload {
  oldVendor: Vendor;
  trx: Knex.Transaction;
}

export interface IVendorActivatedPayload {
  vendor: Vendor;
  oldVendor: Vendor;
  trx?: Knex.Transaction;
}
