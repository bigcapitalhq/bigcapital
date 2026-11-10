import type { RecurringJournal } from '@bigcapital/sdk-ts';

export type RecurringJournalDetailTabId = 'details' | 'journals';

export const RECURRING_JOURNAL_DETAIL_TABS = {
  DETAILS: 'details' as RecurringJournalDetailTabId,
  JOURNALS: 'journals' as RecurringJournalDetailTabId,
};

/**
 * The SDK's entry shape types nested relations loosely. The backend returns
 * accounts, contacts, branches, and tracking category assignments with the
 * fields the details table reads.
 */
export type RecurringJournalDetailEntry = NonNullable<
  RecurringJournal['entries']
>[number] & {
  account?: { name?: string };
  contact?: { name?: string; displayName?: string; display_name?: string };
  branch?: { name?: string };
  trackingCategories?: Array<{
    categoryId: number;
    optionId: number;
    category?: { id: number; name: string; active?: boolean | number };
    option?: { id: number; name: string; active?: boolean | number };
  }>;
};

export interface RecurringJournalDetail
  extends Omit<RecurringJournal, 'entries'> {
  entries: RecurringJournalDetailEntry[];
}
