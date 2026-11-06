import { omit } from 'lodash';
import moment from 'moment';
import type { AccountingBasis } from '@/hooks/query';
import type {
  CreateRecurringJournalBody,
  RecurringJournal,
} from '@bigcapital/sdk-ts';
import {
  defaultEntry,
  type MakeJournalEntry,
} from '@/containers/Accounting/MakeJournal/utils';
import { orderingLinesIndexes } from '@/utils';

export type RecurringJournalEntry = MakeJournalEntry;

export type RecurringJournalFormValues = {
  profileName: string;
  reference: string;
  description: string;
  journalType: string;
  basis: AccountingBasis | '';
  currencyCode: string;
  exchangeRate: number;
  branchId: string | number;
  startDate: string;
  endDate: string;
  frequency: string;
  repeatInterval: number;
  maxOccurrences: number | '';
  autoPublish: boolean;
  entries: RecurringJournalEntry[];
};

export const defaultRecurringJournalEntry: RecurringJournalEntry = {
  ...defaultEntry,
};

export const defaultRecurringJournal: RecurringJournalFormValues = {
  profileName: '',
  reference: '',
  description: '',
  journalType: 'Journal',
  basis: '',
  currencyCode: '',
  exchangeRate: 1,
  branchId: '',
  startDate: moment(new Date()).format('YYYY-MM-DD'),
  endDate: '',
  frequency: 'month',
  repeatInterval: 1,
  maxOccurrences: '',
  autoPublish: false,
  entries: [{ ...defaultRecurringJournalEntry }],
};

/**
 * Transforms the recurring journal profile to form values.
 */
export function transformRecurringJournalToForm(
  recurringJournal: RecurringJournal,
): RecurringJournalFormValues {
  const entries: RecurringJournalEntry[] = (recurringJournal.entries ?? []).map(
    (entry: any) => ({
      accountId: entry.accountId ?? '',
      credit: entry.credit ?? '',
      debit: entry.debit ?? '',
      contactId: entry.contactId ?? '',
      branchId: entry.branchId ?? '',
      trackingCategories: (entry.trackingCategories ?? []).map(
        (assignment: any) => ({
          categoryId: assignment.categoryId,
          optionId: assignment.optionId,
        }),
      ),
      note: entry.note ?? '',
    }),
  );

  return {
    profileName: recurringJournal.profileName ?? '',
    reference: recurringJournal.reference ?? '',
    description: recurringJournal.description ?? '',
    journalType: recurringJournal.journalType ?? 'Journal',
    basis: (recurringJournal.basis as AccountingBasis) ?? '',
    currencyCode: recurringJournal.currencyCode ?? '',
    exchangeRate: Number(recurringJournal.exchangeRate) || 1,
    branchId: recurringJournal.branchId ?? '',
    startDate: recurringJournal.startDate ?? '',
    endDate: recurringJournal.endDate ?? '',
    frequency: recurringJournal.frequency ?? 'month',
    repeatInterval: Number(recurringJournal.repeatInterval) || 1,
    maxOccurrences: recurringJournal.maxOccurrences ?? '',
    autoPublish: !!recurringJournal.autoPublish,
    entries: entries.length ? entries : [{ ...defaultRecurringJournalEntry }],
  };
}

/**
 * Transforms form values to the create/edit request body.
 */
export function transformRecurringJournalToRequest(
  values: RecurringJournalFormValues,
): CreateRecurringJournalBody {
  const nonZeroEntries = values.entries.filter(
    (entry) => entry.debit || entry.credit,
  );
  const entries = orderingLinesIndexes(nonZeroEntries).map(
    (entry: RecurringJournalEntry) => ({
      ...entry,
      accountId: Number(entry.accountId),
      contactId: entry.contactId ? Number(entry.contactId) : undefined,
      branchId: entry.branchId ? Number(entry.branchId) : undefined,
      trackingCategories: (entry.trackingCategories ?? [])
        .filter((assignment) => assignment.categoryId && assignment.optionId)
        .map((assignment) => ({
          categoryId: Number(assignment.categoryId),
          optionId: Number(assignment.optionId),
        })),
    }),
  );

  return {
    ...omit(values, ['entries']),
    branchId: values.branchId === '' ? undefined : Number(values.branchId),
    endDate: values.endDate || undefined,
    maxOccurrences:
      values.maxOccurrences === '' ? undefined : Number(values.maxOccurrences),
    exchangeRate: Number(values.exchangeRate) || 1,
    basis: values.basis || null,
    autoPublish: !!values.autoPublish,
    entries,
  } as unknown as CreateRecurringJournalBody;
}
