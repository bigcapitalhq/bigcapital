import React, { lazy } from 'react';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose, saveInvoke } from '@/utils';

const ReceiptNumberDialogContent = lazy(() =>
  import('./ReceiptNumberDialogContent').then((m) => ({
    default: m.ReceiptNumberDialogContent,
  })),
);

interface ReceiptNumberDialogProps {
  dialogName: string;
  payload: { initialFormValues?: Partial<ReferenceNumberFormValues> };
  isOpen: boolean | undefined;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Sale receipt number dialog.
 */
function ReceiptNumberDialog({
  dialogName,
  payload: { initialFormValues = {} },
  isOpen,
  onConfirm,
}: ReceiptNumberDialogProps): React.ReactElement {
  const handleConfirm = (values: ReferenceNumberFormValues) => {
    saveInvoke(onConfirm, values);
  };

  return (
    <Dialog
      name={dialogName}
      title={<T id={'receipt_number_settings'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <ReceiptNumberDialogContent
          // @ts-expect-error — compose()-wrapped component loses generic prop inference.
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(ReceiptNumberDialog);
