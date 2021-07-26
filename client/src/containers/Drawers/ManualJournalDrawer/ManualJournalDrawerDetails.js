import React from 'react';
import ManualJournalDrawerActionBar from './ManualJournalDrawerActionBar';
import ManualJournalDrawerHeader from './ManualJournalDrawerHeader';
import ManualJournalDrawerTable from './ManualJournalDrawerTable';
import ManualJournalDrawerFooter from './ManualJournalDrawerFooter';

import { useManualJournalDrawerContext } from 'containers/Drawers/ManualJournalDrawer/ManualJournalDrawerProvider';

/**
 * Manual journal view details.
 */
export default function ManualJournalDrawerDetails() {
  const { manualJournal } = useManualJournalDrawerContext();

  return (
    <div className={'journal-drawer'}>
      <ManualJournalDrawerActionBar manualJournal={manualJournal} />
      <div className="journal-drawer__content">
        <ManualJournalDrawerHeader manualJournal={manualJournal} />
        <ManualJournalDrawerTable manualJournal={manualJournal} />
        <ManualJournalDrawerFooter manualJournal={manualJournal} />
      </div>
    </div>
  );
}
