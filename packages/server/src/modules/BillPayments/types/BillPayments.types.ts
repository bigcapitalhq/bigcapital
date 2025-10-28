import { Knex } from 'knex';
import { BillPayment } from '../models/BillPayment';
import { AttachmentLinkDTO } from '@/modules/Attachments/Attachments.types';
import { CreateBillPaymentDto, EditBillPaymentDto } from '../dtos/BillPayment.dto';

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
  billPaymentDTO: CreateBillPaymentDto;
  billPaymentId: number;
  trx: Knex.Transaction;
}

export interface IBillPaymentCreatingPayload {
  billPaymentDTO: CreateBillPaymentDto;
  trx: Knex.Transaction;
}

export interface IBillPaymentEditingPayload {
  billPaymentDTO: EditBillPaymentDto;
  oldBillPayment: BillPayment;
  trx: Knex.Transaction;
}
export interface IBillPaymentEventEditedPayload {
  billPaymentId: number;
  billPayment: BillPayment;
  oldBillPayment: BillPayment;
  billPaymentDTO: EditBillPaymentDto;
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
