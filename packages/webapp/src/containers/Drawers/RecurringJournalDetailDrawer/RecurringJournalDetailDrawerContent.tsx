import React from 'react';
import { RecurringJournalDetail } from './RecurringJournalDetail';
import { RecurringJournalDetailDrawerProvider } from './RecurringJournalDetailDrawerProvider';
import type { RecurringJournalDetailTabId } from './types';
import { DrawerBody } from '@/components';

interface RecurringJournalDetailDrawerContentProps {
  recurringJournalId: number | undefined;
  defaultTab?: RecurringJournalDetailTabId;
  isOpen?: boolean;
}

/**
 * Recurring journal detail drawer content.
 */
export function RecurringJournalDetailDrawerContent({
  recurringJournalId,
  defaultTab,
  isOpen,
}: RecurringJournalDetailDrawerContentProps) {
  return (
    <RecurringJournalDetailDrawerProvider
      recurringJournalId={recurringJournalId}
    >
      <DrawerBody>
        <RecurringJournalDetail defaultTab={defaultTab} isOpen={isOpen} />
      </DrawerBody>
    </RecurringJournalDetailDrawerProvider>
  );
}
