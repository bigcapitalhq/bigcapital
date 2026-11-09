import React from 'react';
import '@/style/pages/RefundCreditNote/RefundCreditNote.scss';
import { RefundCreditNoteForm } from './RefundCreditNoteForm';
import { RefundCreditNoteFormProvider } from './RefundCreditNoteFormProvider';

interface RefundCreditNoteDialogContentProps {
  dialogName: string;
  creditNoteId?: number | null;
}

/**
 * Refund credit note dialog content.
 */
export function RefundCreditNoteDialogContent({
  dialogName,
  creditNoteId,
}: RefundCreditNoteDialogContentProps): React.ReactElement {
  return (
    <RefundCreditNoteFormProvider
      creditNoteId={creditNoteId}
      dialogName={dialogName}
    >
      <RefundCreditNoteForm />
    </RefundCreditNoteFormProvider>
  );
}
