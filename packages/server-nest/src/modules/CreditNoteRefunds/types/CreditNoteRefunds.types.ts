import { Knex } from 'knex';
import { RefundCreditNote } from '../models/RefundCreditNote';
import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';
import { CreditNoteRefundDto } from '../dto/CreditNoteRefund.dto';

export interface ICreditNoteRefundDTO {
  fromAccountId: number;
  amount: number;
  exchangeRate?: number;
  referenceNo: string;
  description: string;
  date: Date;
  branchId?: number;
}

export interface IRefundCreditNotePOJO {
  formattedAmount: string;
}

export interface IRefundCreditNoteDeletedPayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: RefundCreditNote;
}

export interface IRefundCreditNoteDeletingPayload {
  trx: Knex.Transaction;
  refundCreditId: number;
  oldRefundCredit: RefundCreditNote;
}

export interface IRefundCreditNoteCreatingPayload {
  trx: Knex.Transaction;
  creditNote: CreditNote;
  newCreditNoteDTO: CreditNoteRefundDto;
}

export interface IRefundCreditNoteCreatedPayload {
  trx: Knex.Transaction;
  refundCreditNote: RefundCreditNote;
  creditNote: CreditNote;
}

export interface IRefundCreditNoteOpenedPayload {
  creditNoteId: number;
  oldCreditNote: CreditNote;
  trx: Knex.Transaction;
}
