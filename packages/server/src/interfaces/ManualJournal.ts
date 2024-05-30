import { Knex } from 'knex';
import { IDynamicListFilterDTO } from './DynamicFilter';
import { ISystemUser } from './User';
import { IAccount } from './Account';
import { AttachmentLinkDTO } from './Attachments';

export interface IManualJournal {
  id?: number;
  date: Date;
  journalNumber: string;
  journalType: string;
  reference: string;
  amount: number;
  currencyCode: string;
  exchangeRate: number | null;
  publishedAt: Date | null;
  description: string;
  userId?: number;
  entries: IManualJournalEntry[];
  createdAt?: Date;
  updatedAt?: Date;
  isPublished?: boolean;
}

export interface IManualJournalEntry {
  index: number;
  credit: number;
  debit: number;
  accountId: number;
  note: string;
  contactId?: number;
  account?: IAccount

  branchId?: number;
  projectId?: number;
}

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

export interface IManualJournalsFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string;
  page: number;
  pageSize: number;
}

export interface IManualJournalsService {
  makeJournalEntries(
    tenantId: number,
    manualJournalDTO: IManualJournalDTO,
    authorizedUser: ISystemUser
  ): Promise<{ manualJournal: IManualJournal }>;

  editJournalEntries(
    tenantId: number,
    manualJournalId: number,
    manualJournalDTO: IManualJournalDTO,
    authorizedUser
  ): Promise<{ manualJournal: IManualJournal }>;

  deleteManualJournal(tenantId: number, manualJournalId: number): Promise<void>;

  deleteManualJournals(
    tenantId: number,
    manualJournalsIds: number[]
  ): Promise<void>;

  publishManualJournals(
    tenantId: number,
    manualJournalsIds: number[]
  ): Promise<{
    meta: {
      alreadyPublished: number;
      published: number;
      total: number;
    };
  }>;

  publishManualJournal(
    tenantId: number,
    manualJournalId: number
  ): Promise<void>;

  getManualJournals(
    tenantId: number,
    filter: IManualJournalsFilter
  ): Promise<{
    manualJournals: IManualJournal;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }>;
}

export interface IManualJournalEventPublishedPayload {
  tenantId: number;
  manualJournal: IManualJournal;
  manualJournalId: number;
  oldManualJournal: IManualJournal;
  trx: Knex.Transaction;
}

export interface IManualJournalPublishingPayload {
  oldManualJournal: IManualJournal;
  trx: Knex.Transaction;
  tenantId: number;
}

export interface IManualJournalEventDeletedPayload {
  tenantId: number;
  manualJournalId: number;
  oldManualJournal: IManualJournal;
  trx: Knex.Transaction;
}

export interface IManualJournalDeletingPayload {
  tenantId: number;
  oldManualJournal: IManualJournal;
  trx: Knex.Transaction;
}

export interface IManualJournalEventEditedPayload {
  tenantId: number;
  manualJournal: IManualJournal;
  oldManualJournal: IManualJournal;
  manualJournalDTO: IManualJournalDTO;
  trx: Knex.Transaction;
}
export interface IManualJournalEditingPayload {
  tenantId: number;
  oldManualJournal: IManualJournal;
  manualJournalDTO: IManualJournalDTO;
  trx: Knex.Transaction;
}

export interface IManualJournalCreatingPayload {
  tenantId: number;
  manualJournalDTO: IManualJournalDTO;
  trx: Knex.Transaction;
}

export interface IManualJournalEventCreatedPayload {
  tenantId: number;
  manualJournal: IManualJournal;
  manualJournalId: number;
  manualJournalDTO: IManualJournalDTO;
  trx: Knex.Transaction;
}

export enum ManualJournalAction {
  Create = 'Create',
  View = 'View',
  Edit = 'Edit',
  Delete = 'Delete',
}
