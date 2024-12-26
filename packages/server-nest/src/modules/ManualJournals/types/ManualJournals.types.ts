import { Knex } from 'knex';
// import { IDynamicListFilterDTO } from './DynamicFilter';
// import { ISystemUser } from './User';
// import { IAccount } from './Account';
// import { AttachmentLinkDTO } from './Attachments';
import { ManualJournal } from '../models/ManualJournal';
import { AttachmentLinkDTO } from '@/modules/Attachments/Attachments.types';

export interface IManualJournalEntryDTO {
  index: number;
  credit: number;
  debit: number;
  accountId: number;
  note: string;
  contactId?: number;
  branchId?: number
  projectId?: number;
}

export interface IManualJournalDTO {
  date: Date;
  currencyCode?: string;
  exchangeRate?: number;
  journalNumber: string;
  journalType: string;
  reference?: string;
  description?: string;
  publish?: boolean;
  branchId?: number;
  entries: IManualJournalEntryDTO[];
  attachments?: AttachmentLinkDTO[];
}

// export interface IManualJournalsFilter extends IDynamicListFilterDTO {
//   stringifiedFilterRoles?: string;
//   page: number;
//   pageSize: number;
// }

export interface IManualJournalEventPublishedPayload {
  // tenantId: number;
  manualJournal: ManualJournal;
  // manualJournalId: number;
  oldManualJournal: ManualJournal;
  trx: Knex.Transaction;
}

export interface IManualJournalPublishingPayload {
  oldManualJournal: ManualJournal;
  trx: Knex.Transaction;
  // tenantId: number;
}

export interface IManualJournalEventDeletedPayload {
  // tenantId: number;
  manualJournalId: number;
  oldManualJournal: ManualJournal;
  trx?: Knex.Transaction;
}

export interface IManualJournalDeletingPayload {
  // tenantId: number;
  oldManualJournal: ManualJournal;
  trx: Knex.Transaction;
}

export interface IManualJournalEventEditedPayload {
  // tenantId: number;
  manualJournal: ManualJournal;
  oldManualJournal: ManualJournal;
  manualJournalDTO: IManualJournalDTO;
  trx: Knex.Transaction;
}
export interface IManualJournalEditingPayload {
  // tenantId: number;
  oldManualJournal: ManualJournal;
  manualJournalDTO: IManualJournalDTO;
  trx: Knex.Transaction;
}

export interface IManualJournalCreatingPayload {
  // tenantId: number;
  manualJournalDTO: IManualJournalDTO;
  trx: Knex.Transaction;
}

export interface IManualJournalEventCreatedPayload {
  // tenantId: number;
  manualJournal: ManualJournal;
  // manualJournalId: number;
  manualJournalDTO: IManualJournalDTO;
  trx: Knex.Transaction;
}

export enum ManualJournalAction {
  Create = 'Create',
  View = 'View',
  Edit = 'Edit',
  Delete = 'Delete',
}
