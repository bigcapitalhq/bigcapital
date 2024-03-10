// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const PaymentMailDialogContent = React.lazy(
  () => import('./PaymentMailDialogContent'),
);

/**
 * Payment mail dialog.
 */
function PaymentMailDialog({
  dialogName,
  payload: {
    paymentReceiveId = null,

    // Redirects to the payments list on mail submitting.
    redirectToPaymentsList = false,
  },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={'Payment Mail'}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      style={{ width: 600 }}
    >
      <DialogSuspense>
        <PaymentMailDialogContent
          dialogName={dialogName}
          paymentReceiveId={paymentReceiveId}
          redirectToPaymentsList={redirectToPaymentsList}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(PaymentMailDialog);
