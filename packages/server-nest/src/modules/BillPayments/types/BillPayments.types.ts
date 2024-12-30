import { Knex } from 'knex';
import { BillPayment } from '../models/BillPayment';
import { AttachmentLinkDTO } from '@/modules/Attachments/Attachments.types';

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

export interface IBillPaymentEventCreatedPayload {
  billPayment: BillPayment;
  billPaymentDTO: IBillPaymentDTO;
  billPaymentId: number;
  trx: Knex.Transaction;
}

export interface IBillPaymentCreatingPayload {
  billPaymentDTO: IBillPaymentDTO;
  trx: Knex.Transaction;
}

export interface IBillPaymentEditingPayload {
  billPaymentDTO: IBillPaymentDTO;
  oldBillPayment: BillPayment;
  trx: Knex.Transaction;
}
export interface IBillPaymentEventEditedPayload {
  billPaymentId: number;
  billPayment: BillPayment;
  oldBillPayment: BillPayment;
  billPaymentDTO: IBillPaymentDTO;
  trx: Knex.Transaction;
}

export interface IBillPaymentEventDeletedPayload {
  billPaymentId: number;
  oldBillPayment: BillPayment;
  trx: Knex.Transaction;
}

export interface IBillPaymentDeletingPayload {
  oldBillPayment: BillPayment;
  trx: Knex.Transaction;
}

export interface IBillPaymentPublishingPayload {
  oldBillPayment: BillPayment;
  trx: Knex.Transaction;
}

export enum IPaymentMadeAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
}
