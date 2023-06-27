// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose, saveInvoke } from '@/utils';

const TransactionNumberDialogContent = React.lazy(
  () => import('./TransactionNumberDialogContent'),
);

/**
 * Transaction number dialog.
 */
function TransactionNumberDialog({
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

export default compose(withDialogRedux())(TransactionNumberDialog);
