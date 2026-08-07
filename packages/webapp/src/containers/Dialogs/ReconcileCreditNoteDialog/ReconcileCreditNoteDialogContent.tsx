import React from 'react';
import { ReconcileCreditNoteForm } from './ReconcileCreditNoteForm';
import { ReconcileCreditNoteFormProvider } from './ReconcileCreditNoteFormProvider';

interface ReconcileCreditNoteDialogContentProps {
  dialogName: string;
  creditNoteId?: number | null;
}

/**
 * Reconcile credit note dialog content.
 */
export function ReconcileCreditNoteDialogContent({
  dialogName,
  creditNoteId,
}: ReconcileCreditNoteDialogContentProps): React.ReactElement {
  return (
    <ReconcileCreditNoteFormProvider
      creditNoteId={creditNoteId}
      dialogName={dialogName}
    >
      <ReconcileCreditNoteForm />
    </ReconcileCreditNoteFormProvider>
  );
}
