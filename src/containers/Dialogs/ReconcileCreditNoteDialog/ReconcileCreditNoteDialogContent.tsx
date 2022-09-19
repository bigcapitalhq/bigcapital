// @ts-nocheck
import React from 'react';
import { ReconcileCreditNoteFormProvider } from './ReconcileCreditNoteFormProvider';
import ReconcileCreditNoteForm from './ReconcileCreditNoteForm';

/**
 * Reconcile credit note dialog content.
 */
export default function ReconcileCreditNoteDialogContent({
  // #ownProps
  dialogName,
  creditNoteId,
}) {
  return (
    <ReconcileCreditNoteFormProvider
      creditNoteId={creditNoteId}
      dialogName={dialogName}
    >
      <ReconcileCreditNoteForm />
    </ReconcileCreditNoteFormProvider>
  );
}
