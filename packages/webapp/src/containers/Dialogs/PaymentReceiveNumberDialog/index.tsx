// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke, compose } from '@/utils';

const PaymentReceiveNumberDialogContent = lazy(
  () => import('./PaymentReceiveNumberDialogContent'),
);

/**
 * Payment receive number dialog.
 */
function PaymentReceiveNumberDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
}) {
  return (
    <Dialog
      title={<T id={'payment_number_settings'} />}
      name={dialogName}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <PaymentReceiveNumberDialogContent
          initialValues={initialFormValues}
          onConfirm={(values) => saveInvoke(onConfirm, values)}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(PaymentReceiveNumberDialog);
