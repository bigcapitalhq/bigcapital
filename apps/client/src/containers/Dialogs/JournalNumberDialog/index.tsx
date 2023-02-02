// @ts-nocheck
import React, { lazy } from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke, compose } from '@/utils';

const JournalNumberDialogContent = lazy(() => import('./JournalNumberDialogContent'));

function JournalNumberDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm
}) {
  const handleConfirm = (values) => {
    saveInvoke(onConfirm, values)
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
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(
  withDialogRedux(),
)(JournalNumberDialog);
