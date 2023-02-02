// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose, saveInvoke } from '@/utils';

const ReceiptNumberDialogContent = lazy(
  () => import('./ReceiptNumberDialogContent'),
);

/**
 * Sale receipt number dialog.
 */
function ReceiptNumberDialog({
  dialogName,
  payload: { initialFormValues = {} },
  isOpen,
  onConfirm,
}) {
  const handleConfirm = (values) => {
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
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(ReceiptNumberDialog);
