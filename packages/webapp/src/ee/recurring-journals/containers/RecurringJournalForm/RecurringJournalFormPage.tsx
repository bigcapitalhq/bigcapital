import React from 'react';
import { useParams } from 'react-router-dom';
import '@/style/pages/ManualJournal/MakeJournal.scss';
import { RecurringJournalForm } from './RecurringJournalForm';
import { RecurringJournalFormProvider } from './RecurringJournalFormProvider';

export function RecurringJournalFormPage() {
  const { id } = useParams<{ id?: string }>();
  const recurringJournalId = id ? parseInt(id, 10) : undefined;

  return (
    <RecurringJournalFormProvider recurringJournalId={recurringJournalId}>
      <RecurringJournalForm />
    </RecurringJournalFormProvider>
  );
}
