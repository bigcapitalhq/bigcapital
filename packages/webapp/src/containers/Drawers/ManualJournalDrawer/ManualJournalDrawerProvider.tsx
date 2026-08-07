import React from 'react';
import intl from 'react-intl-universal';
import type { ManualJournal } from '@bigcapital/sdk-ts';
import { DrawerLoading, DrawerHeaderContent } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useJournal } from '@/hooks/query';

/**
 * The SDK's entry shape types `account`, `contact`, and `branch` as
 * `Record<string, never>`. The backend actually returns nested objects with
 * `name` / `display_name` keys, which the detail drawer's table column
 * accessors read. Augmented locally until the schema is updated.
 */
export type ManualJournalDetailEntry = ManualJournal['entries'][number] & {
  account?: { name?: string };
  contact?: { name?: string; display_name?: string };
  branch?: { name?: string };
};

export interface ManualJournalDetail extends Omit<ManualJournal, 'entries'> {
  entries: ManualJournalDetailEntry[];
}

export interface ManualJournalDrawerContextValue {
  manualJournalId: number | undefined;
  manualJournal: ManualJournalDetail | undefined;
  isJournalFetching: boolean;
  isJournalLoading: boolean;
}

interface ManualJournalDrawerProviderProps {
  manualJournalId: number | undefined;
  children?: React.ReactNode;
}

const ManualJournalDrawerContext = React.createContext<
  ManualJournalDrawerContextValue | undefined
>(undefined);

/**
 * Manual journal drawer provider.
 */
function ManualJournalDrawerProvider({
  manualJournalId,
  ...props
}: ManualJournalDrawerProviderProps) {
  // Fetch the specific manual journal details.
  const {
    data,
    isLoading: isJournalLoading,
    isFetching: isJournalFetching,
  } = useJournal(manualJournalId, {
    enabled: !!manualJournalId,
  });
  const manualJournal = data as ManualJournalDetail | undefined;

  // Provider.
  const provider: ManualJournalDrawerContextValue = {
    manualJournalId,
    manualJournal,

    isJournalFetching,
    isJournalLoading,
  };

  return (
    <DrawerLoading loading={isJournalLoading}>
      <DrawerHeaderContent
        name={DRAWERS.JOURNAL_DETAILS}
        title={intl.get('manual_journal.drawer.title', {
          number: manualJournal?.journalNumber,
        })}
      />
      <ManualJournalDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useManualJournalDrawerContext = (): ManualJournalDrawerContextValue => {
  const ctx = React.useContext(ManualJournalDrawerContext);
  if (ctx === undefined) {
    throw new Error(
      'useManualJournalDrawerContext must be used within a ManualJournalDrawerProvider',
    );
  }
  return ctx;
};

export { ManualJournalDrawerProvider, useManualJournalDrawerContext };
