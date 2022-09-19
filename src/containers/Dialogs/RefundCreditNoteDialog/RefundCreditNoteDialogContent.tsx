// @ts-nocheck
import React from 'react';

import '@/style/pages/RefundCreditNote/RefundCreditNote.scss';
import { RefundCreditNoteFormProvider } from './RefundCreditNoteFormProvider';
import RefundCreditNoteForm from './RefundCreditNoteForm';

/**
 * Refund credit note dialog content.
 */
export default function RefundCreditNoteDialogContent({
  // #ownProps
  dialogName,
  creditNoteId,
}) {
  return (
    <RefundCreditNoteFormProvider
      creditNoteId={creditNoteId}
      dialogName={dialogName}
    >
      <RefundCreditNoteForm />
    </RefundCreditNoteFormProvider>
  );
}
