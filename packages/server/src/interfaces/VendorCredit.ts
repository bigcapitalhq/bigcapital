import { DiscountType, IDynamicListFilter, IItemEntry, IItemEntryDTO } from '@/interfaces';
import { Knex } from 'knex';
import { AttachmentLinkDTO } from './Attachments';

export enum VendorCreditAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  Refund = 'Refund',
}

export interface IVendorCredit {
  id: number | null;
  vendorId: number;
  amount: number;
  localAmount?: number;
  currencyCode: string;
  exchangeRate: number;
  vendorCreditNumber: string;
  vendorCreditDate: Date;
  referenceNo: string;
  entries?: IItemEntry[];
  openedAt: Date | null;
  isOpen: boolean;
  isPublished: boolean;
  isClosed: boolean;
  isDraft: boolean;
  creditsRemaining: number;
  branchId?: number;
  warehouseId?: number,
}

export interface IVendorCreditEntryDTO extends IItemEntryDTO {}

export interface IRefundVendorCredit {
  id?: number | null;
  date: Date;
  referenceNo: string;
  amount: number;
  currencyCode: string;
  exchangeRate: number;
  depositAccountId: number;
  description: string;
  vendorCreditId: number;
  createdAt: Date | null;
  userId: number;
  branchId?: number;

  vendorCredit?: IVendorCredit
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
  tenantId: number;
  refundVendorCreditDTO: IRefundVendorCreditDTO;
  vendorCreditId: number;
}

export interface IVendorCreditCreatingPayload {
  tenantId: number;
  vendorCredit: IVendorCredit;
  vendorCreditId: number;
  vendorCreditCreateDTO: IVendorCreditCreateDTO;
  trx: Knex.Transaction;
}

export interface IVendorCreditCreatedPayload {
  tenantId: number;
  vendorCredit: IVendorCredit;
  vendorCreditCreateDTO: IVendorCreditCreateDTO;
  trx: Knex.Transaction;
}

export interface IVendorCreditCreatedPayload {}
export interface IVendorCreditDeletedPayload {
  trx: Knex.Transaction;
  tenantId: number;
  vendorCreditId: number;
  oldVendorCredit: IVendorCredit;
}

export interface IVendorCreditDeletingPayload {
  trx: Knex.Transaction;
  tenantId: number;
  oldVendorCredit: IVendorCredit;
}

export interface IVendorCreditsQueryDTO extends IDynamicListFilter {
  page: number;
  pageSize: number;
  searchKeyword?: string;
  filterQuery?: (q: any) => void;
}

export interface IVendorCreditEditingPayload {
  tenantId: number;
  oldVendorCredit: IVendorCredit;
  vendorCreditDTO: IVendorCreditEditDTO;
  trx: Knex.Transaction;
}

export interface IVendorCreditEditedPayload {
  tenantId: number;
  oldVendorCredit: IVendorCredit;
  vendorCredit: IVendorCredit;
  vendorCreditId: number;
  vendorCreditDTO: IVendorCreditEditDTO;
  trx: Knex.Transaction;
}

export interface IRefundVendorCreditDTO {
  amount: number;
  exchangeRate?: number;
  depositAccountId: number;
  description: string;
  date: Date;
  branchId?: number;
}

export interface IRefundVendorCreditDeletedPayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: IRefundVendorCredit;
  tenantId: number;
}

export interface IRefundVendorCreditDeletePayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: IRefundVendorCredit;
  tenantId: number;
}
export interface IRefundVendorCreditDeletingPayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: IRefundVendorCredit;
  tenantId: number;
}

export interface IRefundVendorCreditCreatingPayload {
  trx: Knex.Transaction;
  vendorCredit: IVendorCredit;
  refundVendorCreditDTO: IRefundVendorCreditDTO;
  tenantId: number;
}

export interface IRefundVendorCreditCreatedPayload {
  refundVendorCredit: IRefundVendorCredit;
  vendorCredit: IVendorCredit;
  trx: Knex.Transaction;
  tenantId: number;
}
export interface IRefundVendorCreditPOJO {}

export interface IApplyCreditToBillEntryDTO {
  amount: number;
  billId: number;
}

export interface IApplyCreditToBillsDTO {
  entries: IApplyCreditToBillEntryDTO[];
}

export interface IVendorCreditOpenedPayload {
  tenantId: number;
  vendorCreditId: number;
  vendorCredit: IVendorCredit;
  trx: Knex.Transaction;
}

export interface IVendorCreditOpenPayload {
  tenantId: number;
  vendorCreditId: number;
  oldVendorCredit: IVendorCredit;
}

export interface IVendorCreditOpeningPayload {
  tenantId: number;
  vendorCreditId: number;
  oldVendorCredit: IVendorCredit;
  trx: Knex.Transaction;
}

export interface IVendorCreditApplyToBillsCreatedPayload {
  tenantId: number;
  vendorCredit: IVendorCredit;
  vendorCreditAppliedBills: IVendorCreditAppliedBill[];
  trx: Knex.Transaction;
}
export interface IVendorCreditApplyToBillsCreatingPayload {
  trx: Knex.Transaction;
}
export interface IVendorCreditApplyToBillsCreatePayload {
  trx: Knex.Transaction;
}
export interface IVendorCreditApplyToBillDeletedPayload {
  tenantId: number;
  vendorCredit: IVendorCredit;
  oldCreditAppliedToBill: IVendorCreditAppliedBill;
  trx: Knex.Transaction;
}

export interface IVendorCreditApplyToInvoiceDTO {
  amount: number;
  billId: number;
}

export interface IVendorCreditApplyToInvoicesDTO {
  entries: IVendorCreditApplyToInvoiceDTO[];
}

export interface IVendorCreditApplyToInvoiceModel {
  billId: number;
  amount: number;
  vendorCreditId: number;
}

export interface IVendorCreditApplyToInvoicesModel {
  entries: IVendorCreditApplyToInvoiceModel[];
  amount: number;
}

export interface IVendorCreditAppliedBill {
  billId: number;
  amount: number;
  vendorCreditId: number;
}
