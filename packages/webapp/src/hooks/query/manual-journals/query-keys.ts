// Query key constants
export const MANUAL_JOURNALS = 'MANUAL_JOURNALS';
export const MANUAL_JOURNAL = 'MANUAL_JOURNAL';

// Query key factory
export const manualJournalsKeys = {
  all: () => [MANUAL_JOURNALS] as const,
  list: (query?: Record<string, unknown>) => [MANUAL_JOURNALS, query] as const,
  detail: (id: number | null | undefined) => [MANUAL_JOURNAL, id] as const,
};

// Grouped object for use in components/hooks
export const ManualJournalsQueryKeys = {
  MANUAL_JOURNALS,
  MANUAL_JOURNAL,
} as const;
