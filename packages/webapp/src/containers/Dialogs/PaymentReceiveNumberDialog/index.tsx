// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke } from '@/utils';
import { flow } from 'fp-ts/function';

const PaymentReceiveNumbereDialogContent = lazy(() =>
  import('./PaymentReceiveNumberDialogContent').then((m) => ({
    default: m.PaymentReceiveNumberDialogContent,
  })),
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
        <PaymentReceiveNumbereDialogContent
          initialValues={initialFormValues}
          onConfirm={(values) => saveInvoke(onConfirm, values)}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(
  PaymentReceiveNumberDialog,
);
