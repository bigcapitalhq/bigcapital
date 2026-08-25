import React, { lazy } from 'react';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke, compose } from '@/utils';

const JournalNumberDialogContent = lazy(() =>
  import('./JournalNumberDialogContent').then((m) => ({
    default: m.JournalNumberDialogContent,
  })),
);

interface JournalNumberDialogProps {
  dialogName: string;
  payload: { initialFormValues?: Partial<ReferenceNumberFormValues> };
  isOpen: boolean | undefined;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

function JournalNumberDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
}: JournalNumberDialogProps): React.ReactElement {
  const handleConfirm = (values: ReferenceNumberFormValues) => {
    saveInvoke(onConfirm, values);
  };

  return (
    <Dialog
      name={dialogName}
      title={<T id={'journal_number_settings'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className={'dialog--journal-number-settings'}
    >
      <DialogSuspense>
        <JournalNumberDialogContent
          // @ts-expect-error — compose()-wrapped component loses generic prop inference.
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(JournalNumberDialog);
