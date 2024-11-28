import { Knex } from 'knex';
import { DiscountType, IDynamicListFilter, IItemEntry } from '@/interfaces';
import { ILedgerEntry } from './Ledger';
import { AttachmentLinkDTO } from './Attachments';

export interface ICreditNoteEntryNewDTO {
  index?: number;
  itemId: number;
  rate: number;
  quantity: number;
  discount: number;
  description: string;
  warehouseId?: number;
}
export interface ICreditNoteNewDTO {
  customerId: number;
  exchangeRate?: number;
  creditNoteDate: Date;
  creditNoteNumber: string;
  note: string;
  open: boolean;
  entries: ICreditNoteEntryNewDTO[];
  branchId?: number;
  warehouseId?: number;
  attachments?: AttachmentLinkDTO[];
  discount?: number;
  discountType?: DiscountType;
  adjustment?: number;
}

export interface ICreditNoteEditDTO {
  customerId: number;
  exchangeRate?: number;
  creditNoteDate: Date;
  creditNoteNumber: string;
  note: string;
  open: boolean;
  entries: ICreditNoteEntryNewDTO[];
  branchId?: number;
  warehouseId?: number;
  attachments?: AttachmentLinkDTO[];
}

export interface ICreditNoteEntry extends IItemEntry {}

export interface ICreditNote {
  id?: number;
  customerId: number;
  amount: number;
  refundedAmount: number;
  currencyCode: string;
  exchangeRate: number;
  creditNoteDate: Date;
  creditNoteNumber: string;
  referenceNo?: string;
  note?: string;
  openedAt: Date | null;
  entries: ICreditNoteEntry[];
  isOpen: boolean;
  isClosed: boolean;
  isDraft: boolean;
  isPublished: boolean;
  creditsRemaining: number;
  localAmount?: number;
  branchId?: number;
  warehouseId: number;
  createdAt?: Date;
  termsConditions: string;
  note: string;
}

export enum CreditNoteAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  Refund = 'Refund',
}

export interface ICreditNoteDeletingPayload {
  tenantId: number;
  oldCreditNote: ICreditNote;
  trx: Knex.Transaction;
}

export interface ICreditNoteDeletedPayload {
  tenantId: number;
  oldCreditNote: ICreditNote;
  creditNoteId: number;
  trx: Knex.Transaction;
}

export interface ICreditNoteEditingPayload {
  trx: Knex.Transaction;
  oldCreditNote: ICreditNote;
  creditNoteEditDTO: ICreditNoteEditDTO;
  tenantId: number;
}

export interface ICreditNoteEditedPayload {
  trx: Knex.Transaction;
  oldCreditNote: ICreditNote;
  creditNoteId: number;
  creditNote: ICreditNote;
  creditNoteEditDTO: ICreditNoteEditDTO;
  tenantId: number;
}

export interface ICreditNoteCreatedPayload {
  tenantId: number;
  creditNoteDTO: ICreditNoteNewDTO;
  creditNote: ICreditNote;
  creditNoteId: number;
  trx: Knex.Transaction;
}

export interface ICreditNoteCreatingPayload {
  tenantId: number;
  creditNoteDTO: ICreditNoteNewDTO;
  trx: Knex.Transaction;
}

export interface ICreditNoteOpeningPayload {
  tenantId: number;
  creditNoteId: number;
  oldCreditNote: ICreditNote;
  trx: Knex.Transaction;
}

export interface ICreditNoteOpenedPayload {
  tenantId: number;
  creditNote: ICreditNote;
  creditNoteId: number;
  oldCreditNote: ICreditNote;
  trx: Knex.Transaction;
}

export interface ICreditNotesQueryDTO {
  filterQuery?: (query: any) => void;
}

export interface ICreditNotesQueryDTO extends IDynamicListFilter {
  page: number;
  pageSize: number;
  searchKeyword?: string;
}

export interface ICreditNoteRefundDTO {
  fromAccountId: number;
  amount: number;
  exchangeRate?: number;
  referenceNo: string;
  description: string;
  date: Date;
  branchId?: number;
}

export interface ICreditNoteApplyInvoiceDTO {
  entries: { invoiceId: number; amount: number }[];
}

export interface IRefundCreditNote {
  id?: number | null;
  date: Date;
  referenceNo: string;
  amount: number;
  currencyCode: string;
  exchangeRate: number;
  fromAccountId: number;
  description: string;
  creditNoteId: number;
  createdAt?: Date | null;
  userId?: number;
  branchId?: number;

  creditNote?: ICreditNote;
}

export interface IRefundCreditNotePOJO {
  formattedAmount: string;
}

export interface IRefundCreditNoteDeletedPayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: IRefundCreditNote;
  tenantId: number;
}

export interface IRefundCreditNoteDeletingPayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: IRefundCreditNote;
  tenantId: number;
}

export interface IRefundCreditNoteCreatingPayload {
  trx: Knex.Transaction;
  creditNote: ICreditNote;
  tenantId: number;
  newCreditNoteDTO: ICreditNoteRefundDTO;
}

export interface IRefundCreditNoteCreatedPayload {
  trx: Knex.Transaction;
  refundCreditNote: IRefundCreditNote;
  creditNote: ICreditNote;
  tenantId: number;
}

export interface IRefundCreditNoteOpenedPayload {
  tenantId: number;
  creditNoteId: number;
  oldCreditNote: ICreditNote;
  trx: Knex.Transaction;
}

export interface IApplyCreditToInvoiceEntryDTO {
  amount: number;
  invoiceId: number;
}

export interface IApplyCreditToInvoicesDTO {
  entries: IApplyCreditToInvoiceEntryDTO[];
}

export interface IApplyCreditToInvoicesCreatedPayload {
  trx: Knex.Transaction;
  creditNote: ICreditNote;
  tenantId: number;
  creditNoteAppliedInvoices: ICreditNoteAppliedToInvoice[];
}
export interface IApplyCreditToInvoicesDeletedPayload {
  trx: Knex.Transaction;
  creditNote: ICreditNote;
  creditNoteAppliedToInvoice: ICreditNoteAppliedToInvoice;
  tenantId: number;
}

export interface ICreditNoteAppliedToInvoice {
  invoiceId: number;
  amount: number;
  creditNoteId: number;
}
export interface ICreditNoteAppliedToInvoiceModel {
  amount: number;
  entries: ICreditNoteAppliedToInvoice[];
}

export type ICreditNoteGLCommonEntry = Pick<
  ILedgerEntry,
  | 'date'
  | 'userId'
  | 'currencyCode'
  | 'exchangeRate'
  | 'transactionType'
  | 'transactionId'
  | 'transactionNumber'
  | 'referenceNumber'
  | 'createdAt'
  | 'indexGroup'
  | 'credit'
  | 'debit'
  | 'branchId'
>;

export interface CreditNotePdfTemplateAttributes {
  // # Primary color
  primaryColor: string;
  secondaryColor: string;

  // # Company logo
  showCompanyLogo: boolean;
  companyLogo: string;

  // # Company name
  companyName: string;

  // # Customer Address
  showCustomerAddress: boolean;
  customerAddress: string;

  // # Company address
  showCompanyAddress: boolean;
  companyAddress: string;
  billedToLabel: string;

  total: string;
  totalLabel: string;
  showTotal: boolean;

  subtotal: string;
  subtotalLabel: string;
  showSubtotal: boolean;

  showCustomerNote: boolean;
  customerNote: string;
  customerNoteLabel: string;

  showTermsConditions: boolean;
  termsConditions: string;
  termsConditionsLabel: string;

  lines: Array<{
    item: string;
    description: string;
    rate: string;
    quantity: string;
    total: string;
  }>;

  showCreditNoteNumber: boolean;
  creditNoteNumberLabel: string;
  creditNoteNumebr: string;

  creditNoteDate: string;
  showCreditNoteDate: boolean;
  creditNoteDateLabel: string;
}

export interface ICreditNoteState {
  defaultTemplateId: number;
}