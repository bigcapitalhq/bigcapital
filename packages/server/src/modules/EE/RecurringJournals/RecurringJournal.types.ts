import { Knex } from 'knex';
import { IDynamicListFilter } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { RecurringJournal } from './models/RecurringJournal';

export const RECURRING_JOURNALS_QUEUE = 'recurring-journals';
export const RECURRING_JOURNALS_SCAN_JOB = 'scan-recurring-journals';
export const RECURRING_JOURNALS_PROCESS_TENANT_JOB =
  'process-tenant-recurring-journals';

export { RecurringJournalAction } from '@/modules/Roles/Roles.types';

export enum RecurringJournalStatus {
  Active = 'active',
  Paused = 'paused',
  Completed = 'completed',
}

export { RecurrenceFrequency as RecurringJournalFrequency } from '@/utils/recurrence';

export const ERRORS = {
  RECURRING_JOURNAL_NOT_FOUND: 'RECURRING_JOURNAL_NOT_FOUND',
  RECURRING_JOURNAL_PROFILE_NAME_REQUIRED:
    'RECURRING_JOURNAL_PROFILE_NAME_REQUIRED',
  RECURRING_JOURNAL_START_DATE_REQUIRED:
    'RECURRING_JOURNAL_START_DATE_REQUIRED',
  RECURRING_JOURNAL_END_DATE_INVALID: 'RECURRING_JOURNAL_END_DATE_INVALID',
  RECURRING_JOURNAL_ALREADY_COMPLETED: 'RECURRING_JOURNAL_ALREADY_COMPLETED',
  RECURRING_JOURNAL_ALREADY_PAUSED: 'RECURRING_JOURNAL_ALREADY_PAUSED',
  RECURRING_JOURNAL_NOT_PAUSED: 'RECURRING_JOURNAL_NOT_PAUSED',
  RECURRING_JOURNAL_END_CONDITION_REACHED:
    'RECURRING_JOURNAL_END_CONDITION_REACHED',
  RECURRING_JOURNAL_AUTO_INCREMENT_REQUIRED:
    'RECURRING_JOURNAL_AUTO_INCREMENT_REQUIRED',
  RECURRING_JOURNAL_FEATURE_NOT_ENABLED:
    'RECURRING_JOURNAL_FEATURE_NOT_ENABLED',
};

export interface IRecurringJournalsFilter extends IDynamicListFilter {
  page: number;
  pageSize: number;
  searchKeyword?: string;
  filterQuery?: (q: Knex.QueryBuilder) => void;
}

export interface IRecurringJournalCreatedPayload {
  recurringJournal: RecurringJournal;
  recurringJournalId: number;
  trx: Knex.Transaction;
}

export interface IRecurringJournalEditedPayload {
  recurringJournal: RecurringJournal;
  oldRecurringJournal: RecurringJournal;
  recurringJournalId: number;
  trx: Knex.Transaction;
}

export interface IRecurringJournalDeletedPayload {
  oldRecurringJournal: RecurringJournal;
  recurringJournalId: number;
  trx: Knex.Transaction;
}

export interface IRecurringJournalGeneratedPayload {
  recurringJournal: RecurringJournal;
  manualJournalId: number;
  journalDate: string;
  trx?: Knex.Transaction;
}

export interface IRecurringJournalsTenantJobPayload {
  organizationId: string;
  userId: number;
}
