import { IDynamicListFilterDTO } from "./DynamicFilter";
import { IJournalEntry } from "./Journal";
import { ISystemUser } from "./User";


export interface IManualJournal {
  id: number,
  date: Date|string,
  journalNumber: number,
  journalType: string,
  amount: number,
  status: boolean,
  description: string,
  userId: number,
  entries: IJournalEntry[],
}

export interface IManualJournalEntryDTO {
  index: number,
  credit: number,
  debit: number,
  accountId: number,
  note?: string,
  contactId?: number,
  contactType?: string,
}

export interface IManualJournalDTO {
  date: Date,
  journalNumber: number,
  journalType: string,
  reference?: string,
  description?: string,
  status?: string,
  entries: IManualJournalEntryDTO[],
  mediaIds: number[],
}

export interface IManualJournalsFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string,
  page?: number,
  pageSize?: number,
}

export interface IManuaLJournalsService {
  makeJournalEntries(tenantId: number, manualJournalDTO: IManualJournalDTO, authorizedUser: ISystemUser): Promise<{ manualJournal: IManualJournal }>;
  editJournalEntries(tenantId: number, manualJournalId: number, manualJournalDTO: IManualJournalDTO, authorizedUser): Promise<{ manualJournal: IManualJournal }>;
  deleteManualJournal(tenantId: number, manualJournalId: number): Promise<void>;
  deleteManualJournals(tenantId: number, manualJournalsIds: number[]): Promise<void>;
  publishManualJournals(tenantId: number, manualJournalsIds: number[]): Promise<void>;
  publishManualJournal(tenantId: number, manualJournalId: number): Promise<void>;
  getManualJournals(tenantId: number, filter: IManualJournalsFilter): Promise<void>;
}