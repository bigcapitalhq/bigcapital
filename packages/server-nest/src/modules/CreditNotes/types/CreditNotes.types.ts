import { Knex } from 'knex';
import { CreditNote } from '../models/CreditNote';
import { RefundCreditNote } from '../../CreditNoteRefunds/models/RefundCreditNote';
import { AttachmentLinkDTO } from '@/modules/Attachments/Attachments.types';
import { IItemEntryDTO } from '@/modules/TransactionItemEntry/ItemEntry.types';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { IDynamicListFilter } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { EditCreditNoteDto } from '../dtos/CreditNote.dto';

export interface ICreditNoteEntryNewDTO extends IItemEntryDTO {}

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
  // discountType?: DiscountType;
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

export enum CreditNoteAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  Refund = 'Refund',
}

export interface ICreditNoteDeletingPayload {
  tenantId: number;
  oldCreditNote: CreditNote;
  trx: Knex.Transaction;
}

export interface ICreditNoteDeletedPayload {
  tenantId: number;
  oldCreditNote: CreditNote;
  creditNoteId: number;
  trx: Knex.Transaction;
}

export interface ICreditNoteEditingPayload {
  oldCreditNote: CreditNote;
  creditNoteEditDTO: EditCreditNoteDto;
  trx?: Knex.Transaction;
}

export interface ICreditNoteEditedPayload {
  trx?: Knex.Transaction;
  oldCreditNote: CreditNote;
  creditNote: CreditNote;
  creditNoteEditDTO: EditCreditNoteDto;
}

export interface ICreditNoteCreatedPayload {
  creditNoteDTO: ICreditNoteNewDTO;
  creditNote: CreditNote;
  trx: Knex.Transaction;
}

export interface ICreditNoteCreatingPayload {
  creditNoteDTO: ICreditNoteNewDTO;
  trx: Knex.Transaction;
}

export interface ICreditNoteOpeningPayload {
  oldCreditNote: CreditNote;
  trx: Knex.Transaction;
}

export interface ICreditNoteOpenedPayload {
  creditNote: CreditNote;
  oldCreditNote: CreditNote;
  trx: Knex.Transaction;
}
export interface ICreditNotesQueryDTO extends IDynamicListFilter {
  page: number;
  pageSize: number;
  searchKeyword?: string;
  filterQuery?: (builder: Knex.QueryBuilder) => void;
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

export interface GetCreditNotesResponse {
  creditNotes: CreditNote[];
  pagination: IPaginationMeta;
  filterMeta: IFilterMeta;
}

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
