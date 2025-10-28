import { Knex } from 'knex';
import { VendorCredit } from '../models/VendorCredit';
import { AttachmentLinkDTO } from '@/modules/Attachments/Attachments.types';
import { IRefundVendorCreditDTO } from '@/modules/VendorCreditsRefund/types/VendorCreditRefund.types';
import { IItemEntryDTO } from '@/modules/TransactionItemEntry/ItemEntry.types';
import { DiscountType } from '@/common/types/Discount';
import { IDynamicListFilter } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import {
  CreateVendorCreditDto,
  EditVendorCreditDto,
} from '../dtos/VendorCredit.dto';

export enum VendorCreditAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  Refund = 'Refund',
}

export interface IVendorCreditEntryDTO extends IItemEntryDTO {}

export interface IVendorCreditsQueryDTO extends IDynamicListFilter {
  page: number;
  pageSize: number;
  searchKeyword?: string;
  filterQuery?: (q: any) => void;
}

export interface IVendorCreditDTO {
  vendorId: number;
  exchangeRate?: number;
  vendorCreditNumber: string;
  referenceNo: string;
  vendorCreditDate: Date;
  note: string;
  open: boolean;
  entries: IVendorCreditEntryDTO[];

  branchId?: number;
  warehouseId?: number;
  attachments?: AttachmentLinkDTO[];

  discount?: number;
  discountType?: DiscountType;

  adjustment?: number;
}

export interface IVendorCreditCreateDTO extends IVendorCreditDTO {}
export interface IVendorCreditEditDTO extends IVendorCreditDTO {}
export interface IVendorCreditCreatePayload {
  refundVendorCreditDTO: IRefundVendorCreditDTO;
}

// Create Vendor Credit Events
// ------------------------
export interface IVendorCreditCreatingPayload {
  vendorCredit: VendorCredit;
  vendorCreditId: number;
  vendorCreditCreateDTO: CreateVendorCreditDto;
  trx: Knex.Transaction;
}

export interface IVendorCreditCreatedPayload {
  vendorCredit: VendorCredit;
  vendorCreditCreateDTO: CreateVendorCreditDto;
  trx: Knex.Transaction;
}

export interface IVendorCreditCreatedPayload {}

// Delete Vendor Credit Events
// ------------------------
export interface IVendorCreditDeletedPayload {
  trx: Knex.Transaction;
  vendorCreditId: number;
  oldVendorCredit: VendorCredit;
}

export interface IVendorCreditDeletingPayload {
  trx: Knex.Transaction;
  oldVendorCredit: VendorCredit;
}

// Edit Vendor Credit Events
// ------------------------
export interface IVendorCreditEditingPayload {
  oldVendorCredit: VendorCredit;
  vendorCreditDTO: EditVendorCreditDto;
  trx: Knex.Transaction;
}

export interface IVendorCreditEditedPayload {
  oldVendorCredit: VendorCredit;
  vendorCredit: VendorCredit;
  vendorCreditDTO: EditVendorCreditDto;
  trx: Knex.Transaction;
}

export interface IApplyCreditToBillEntryDTO {
  amount: number;
  billId: number;
}

// Open Vendor Credit Events
// ------------------------
export interface IVendorCreditOpenedPayload {
  // tenantId: number;
  vendorCreditId: number;
  vendorCredit: VendorCredit;
  trx: Knex.Transaction;
}

export interface IVendorCreditOpenPayload {
  // tenantId: number;
  vendorCreditId: number;
  oldVendorCredit: VendorCredit;
}

export interface IVendorCreditOpeningPayload {
  // tenantId: number;
  vendorCreditId: number;
  oldVendorCredit: VendorCredit;
  trx: Knex.Transaction;
}
