import { Knex } from 'knex';
import { Bill } from '@/modules/Bills/models/Bill';
import { BillPayment } from '../models/BillPayment';
import { AttachmentLinkDTO } from '@/modules/Attachments/Attachments.types';

export interface IBillPaymentEntry {
  id?: number;
  billPaymentId: number;
  billId: number;
  paymentAmount: number;
  bill?: Bill;
}

export interface IBillPayment {
  id?: number;
  vendorId: number;
  amount: number;
  currencyCode: string;
  reference: string;
  paymentAccountId: number;
  paymentNumber: string;
  paymentDate: Date;
  exchangeRate: number | null;
  userId: number;
  entries: IBillPaymentEntry[];
  statement: string;
  createdAt: Date;
  updatedAt: Date;

  localAmount?: number;
  branchId?: number;
}

export interface IBillPaymentEntryDTO {
  billId: number;
  paymentAmount: number;
}

export interface IBillPaymentDTO {
  vendorId: number;
  amount: number;
  paymentAccountId: number;
  paymentNumber?: string;
  paymentDate: Date;
  exchangeRate?: number;
  statement: string;
  reference: string;
  entries: IBillPaymentEntryDTO[];
  branchId?: number;
  attachments?: AttachmentLinkDTO[];
}

export interface IBillReceivePageEntry {
  billId: number;
  entryType: string;
  billNo: string;
  dueAmount: number;
  amount: number;
  totalPaymentAmount: number;
  paymentAmount: number;
  currencyCode: string;
  date: Date | string;
}

export interface IBillPaymentsService {
  validateVendorHasNoPayments(tenantId: number, vendorId): Promise<void>;
}

export interface IBillPaymentEventCreatedPayload {
  // tenantId: number;
  billPayment: BillPayment;
  billPaymentDTO: IBillPaymentDTO;
  billPaymentId: number;
  trx: Knex.Transaction;
}

export interface IBillPaymentCreatingPayload {
  // tenantId: number;
  billPaymentDTO: IBillPaymentDTO;
  trx: Knex.Transaction;
}

export interface IBillPaymentEditingPayload {
  // tenantId: number;
  billPaymentDTO: IBillPaymentDTO;
  oldBillPayment: BillPayment;
  trx: Knex.Transaction;
}
export interface IBillPaymentEventEditedPayload {
  // tenantId: number;
  billPaymentId: number;
  billPayment: BillPayment;
  oldBillPayment: BillPayment;
  billPaymentDTO: IBillPaymentDTO;
  trx: Knex.Transaction;
}

export interface IBillPaymentEventDeletedPayload {
  // tenantId: number;
  billPaymentId: number;
  oldBillPayment: BillPayment;
  trx: Knex.Transaction;
}

export interface IBillPaymentDeletingPayload {
  oldBillPayment: BillPayment;
  trx: Knex.Transaction;
}

export interface IBillPaymentPublishingPayload {
  // tenantId: number;
  oldBillPayment: BillPayment;
  trx: Knex.Transaction;
}

export enum IPaymentMadeAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
}
