export const RECURRING_JOURNALS = 'RECURRING_JOURNALS';
export const RECURRING_JOURNAL = 'RECURRING_JOURNAL';
export const RECURRING_JOURNAL_JOURNALS = 'RECURRING_JOURNAL_JOURNALS';

export const recurringJournalsKeys = {
  all: () => [RECURRING_JOURNALS] as const,
  list: (query?: Record<string, unknown>) =>
    [RECURRING_JOURNALS, query] as const,
  detail: (id: number | null | undefined) => [RECURRING_JOURNAL, id] as const,
  journals: (id: number | null | undefined, query?: Record<string, unknown>) =>
    [RECURRING_JOURNAL_JOURNALS, id, query] as const,
};
