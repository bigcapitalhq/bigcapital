import React from 'react';
import { useParams } from 'react-router-dom';

import '@/style/pages/ManualJournal/MakeJournal.scss';
import { MakeJournalEntriesForm } from './MakeJournalEntriesForm';
import { MakeJournalProvider } from './MakeJournalProvider';

/**
 * Make journal entries page.
 */
export function MakeJournalEntriesPage() {
  const { id: journalId } = useParams<{ id?: string }>();

  return (
    <MakeJournalProvider journalId={journalId}>
      <MakeJournalEntriesForm />
    </MakeJournalProvider>
  );
}
