import React from 'react';
import { useParams } from 'react-router-dom';

import MakeJournalEntriesForm from './MakeJournalEntriesForm';
import { MakeJournalProvider } from './MakeJournalProvider';

import 'style/pages/ManualJournal/MakeJournal.scss';

/**
 * Make journal entries page.
 */
export default function MakeJournalEntriesPage() {
  const { id: journalId } = useParams();
  
  return (
    <MakeJournalProvider journalId={journalId}>
      <MakeJournalEntriesForm />
    </MakeJournalProvider>
  );
}
