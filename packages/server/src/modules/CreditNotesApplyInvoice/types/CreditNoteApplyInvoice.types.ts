import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';
import { Knex } from 'knex';
import { CreditNoteAppliedInvoice } from '../models/CreditNoteAppliedInvoice';

export interface ICreditNoteApplyInvoiceDTO {
  entries: { invoiceId: number; amount: number }[];
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
  creditNote: CreditNote;
  creditNoteAppliedInvoices: CreditNoteAppliedInvoice[];
}
export interface IApplyCreditToInvoicesDeletedPayload {
  trx: Knex.Transaction;
  creditNote: CreditNote;
  creditNoteAppliedToInvoice: CreditNoteAppliedInvoice;
}

export interface ICreditNoteAppliedToInvoice {
  amount: number;
  creditNoteId: number;
}
export interface ICreditNoteAppliedToInvoiceModel {
  amount: number;
  entries: ICreditNoteAppliedToInvoice[];
}
