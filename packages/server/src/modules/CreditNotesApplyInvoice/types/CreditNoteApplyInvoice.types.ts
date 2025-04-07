import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';
import { Knex } from 'knex';

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
  creditNoteAppliedInvoices: ICreditNoteAppliedToInvoice[];
}
export interface IApplyCreditToInvoicesDeletedPayload {
  trx: Knex.Transaction;
  creditNote: CreditNote;
  creditNoteAppliedToInvoice: ICreditNoteAppliedToInvoice;
}

export interface ICreditNoteAppliedToInvoice {
  amount: number;
  creditNoteId: number;
}
export interface ICreditNoteAppliedToInvoiceModel {
  amount: number;
  entries: ICreditNoteAppliedToInvoice[];
}
