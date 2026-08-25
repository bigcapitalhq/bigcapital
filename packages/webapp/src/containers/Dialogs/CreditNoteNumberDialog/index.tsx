import React from 'react';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose, saveInvoke } from '@/utils';

const CreditNoteNumberDialogContent = React.lazy(() =>
  import('./CreditNoteNumberDialogContent').then((m) => ({
    default: m.CreditNoteNumberDialogContent,
  })),
);

interface CreditNoteNumberDialogProps {
  dialogName: string;
  payload: { initialFormValues?: Partial<ReferenceNumberFormValues> };
  isOpen: boolean | undefined;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Credit note number dialog.
 */
function CreditNoteNumberDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
}: CreditNoteNumberDialogProps): React.ReactElement {
  const handleConfirm = (values: ReferenceNumberFormValues) => {
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
          // @ts-expect-error — compose()-wrapped component loses generic prop inference.
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(CreditNoteNumberDialog);
