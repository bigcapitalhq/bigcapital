import React from 'react';
import { RecurringJournalDetailFooter } from './RecurringJournalDetailFooter';
import { RecurringJournalDetailHeader } from './RecurringJournalDetailHeader';
import { RecurringJournalDetailTable } from './RecurringJournalDetailTable';
import { RecurringJournalDetailTableFooter } from './RecurringJournalDetailTableFooter';
import { CommercialDocBox } from '@/components';

/**
 * Recurring journal readonly details tab panel.
 */
export function RecurringJournalDetailTab() {
  return (
    <CommercialDocBox>
      <RecurringJournalDetailHeader />
      <RecurringJournalDetailTable />
      <RecurringJournalDetailTableFooter />
      <RecurringJournalDetailFooter />
    </CommercialDocBox>
  );
}
