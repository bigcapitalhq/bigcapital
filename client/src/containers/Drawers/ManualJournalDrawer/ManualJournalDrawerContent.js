import React from 'react';
import { ManualJournalDrawerProvider } from './ManualJournalDrawerProvider';
import ManualJournalDrawerDetails from './ManualJournalDrawerDetails';

/**
 * Manual Journal drawer content.
 */
export default function ManualJournalDrawerContent({
  // #ownProp
  manualJournalId,
}) {
  return (
    <ManualJournalDrawerProvider manualJournalId={manualJournalId}>
      <ManualJournalDrawerDetails />
    </ManualJournalDrawerProvider>
  );
}
