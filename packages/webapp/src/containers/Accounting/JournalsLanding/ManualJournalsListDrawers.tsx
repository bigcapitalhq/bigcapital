import { DRAWERS } from '@/constants/drawers';
import { index as ManualJournalDrawer } from '@/containers/Drawers/ManualJournalDrawer';

export function ManualJournalsListDrawers() {
  return (
    <>
      <ManualJournalDrawer name={DRAWERS.JOURNAL_DETAILS} />
    </>
  );
}
