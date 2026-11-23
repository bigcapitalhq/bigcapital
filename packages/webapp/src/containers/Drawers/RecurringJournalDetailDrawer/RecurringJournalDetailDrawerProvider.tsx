import React from 'react';
import intl from 'react-intl-universal';
import type { RecurringJournalDetail } from './types';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useRecurringJournal } from '@/hooks/query';

export interface RecurringJournalDetailDrawerContextValue {
  recurringJournalId: number | undefined;
  recurringJournal: RecurringJournalDetail | undefined;
}

interface RecurringJournalDetailDrawerProviderProps {
  recurringJournalId: number | undefined;
  children?: React.ReactNode;
}

const RecurringJournalDetailDrawerContext = React.createContext<
  RecurringJournalDetailDrawerContextValue | undefined
>(undefined);

/**
 * Recurring journal detail drawer provider.
 */
function RecurringJournalDetailDrawerProvider({
  recurringJournalId,
  ...props
}: RecurringJournalDetailDrawerProviderProps) {
  const { isLoading, data } = useRecurringJournal(recurringJournalId, {
    enabled: !!recurringJournalId,
  });
  const recurringJournal = data as RecurringJournalDetail | undefined;

  const provider: RecurringJournalDetailDrawerContextValue = {
    recurringJournalId,
    recurringJournal,
  };

  return (
    <DrawerLoading loading={isLoading}>
      <DrawerHeaderContent
        name={DRAWERS.RECURRING_JOURNAL_DETAILS}
        title={
          recurringJournal?.profileName
            ? intl.get('recurring_journal_details.drawer.title', {
                profileName: recurringJournal.profileName,
              })
            : intl.get('recurring_journal_details')
        }
        subTitle={
          recurringJournal?.nextJournalDateFormatted
            ? intl.get('recurring_journal_details.drawer.subtitle', {
                date: recurringJournal.nextJournalDateFormatted,
              })
            : null
        }
      />
      <RecurringJournalDetailDrawerContext.Provider
        value={provider}
        {...props}
      />
    </DrawerLoading>
  );
}

const useRecurringJournalDetailDrawerContext =
  (): RecurringJournalDetailDrawerContextValue => {
    const ctx = React.useContext(RecurringJournalDetailDrawerContext);
    if (ctx === undefined) {
      throw new Error(
        'useRecurringJournalDetailDrawerContext must be used within a RecurringJournalDetailDrawerProvider',
      );
    }
    return ctx;
  };

export {
  RecurringJournalDetailDrawerProvider,
  useRecurringJournalDetailDrawerContext,
};
