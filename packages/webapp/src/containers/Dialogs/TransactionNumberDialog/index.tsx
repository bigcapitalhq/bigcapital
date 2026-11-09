import * as FF from 'fp-ts/function';
import React from 'react';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke } from '@/utils';

const TransactionNumberDialogContent = React.lazy(() =>
  import('./TransactionNumberDialogContent').then((m) => ({
    default: m.TransactionNumberDialogContent,
  })),
);

interface TransactionNumberDialogProps {
  dialogName: string;
  payload: { initialFormValues?: Partial<ReferenceNumberFormValues> };
  isOpen: boolean | undefined;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Transaction number dialog.
 */
function TransctionNumberDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
}: TransactionNumberDialogProps): React.ReactElement {
  const handleConfirm = (values: ReferenceNumberFormValues) => {
    saveInvoke(onConfirm, values);
  };

  return (
    <Dialog
      title={<T id={'transaction_number_settings'} />}
      name={dialogName}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <TransactionNumberDialogContent
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = FF.pipe(TransctionNumberDialog, withDialogRedux());
