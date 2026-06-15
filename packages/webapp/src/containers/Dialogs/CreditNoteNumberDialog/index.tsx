// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke } from '@/utils';
import { flow } from 'fp-ts/function';

const CreditNoteNumberDialogContent = React.lazy(() =>
  import('./CreditNoteNumberDialogContent').then((m) => ({
    default: m.CreditNoteNumberDialogContent,
  })),
);

/**
 * Credit note number dialog.
 */
function CreditNoteNumberDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
}) {
  const handleConfirm = (values) => {
    saveInvoke(onConfirm, values);
  };

  return (
    <Dialog
      title={<T id={'credit_note_number_settings'} />}
      name={dialogName}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <CreditNoteNumberDialogContent
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = flow(withDialogRedux())(CreditNoteNumberDialog);
