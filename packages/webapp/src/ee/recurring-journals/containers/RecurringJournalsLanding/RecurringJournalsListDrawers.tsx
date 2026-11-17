import { DRAWERS } from '@/constants/drawers';
import { index as ManualJournalDrawer } from '@/containers/Drawers/ManualJournalDrawer';
import { index as RecurringJournalDetailDrawer } from '@/containers/Drawers/RecurringJournalDetailDrawer';

export function RecurringJournalsListDrawers() {
  return (
    <>
      <RecurringJournalDetailDrawer name={DRAWERS.RECURRING_JOURNAL_DETAILS} />
      <ManualJournalDrawer name={DRAWERS.JOURNAL_DETAILS} />
    </>
  );
}
