import React, { lazy } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { saveInvoke, compose } from 'utils';

const PaymentReceiveNumbereDialogConetnet = lazy(() =>
  import('./PaymentReceiveNumberDialogContent'),
);

/**
 * Payment receive number dialog.
 */
function PaymentReceiveNumberDialog({
  dialogName,
  payload = { id: null },
  isOpen,
  onConfirm
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
        <PaymentReceiveNumbereDialogConetnet
          paymentReceiveNumberId={payload.id}
          onConfirm={(values) => saveInvoke(onConfirm, values)}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(PaymentReceiveNumberDialog);
