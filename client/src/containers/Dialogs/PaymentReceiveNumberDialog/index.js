import React, { lazy } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const PaymentReceiveNumbereDialogConetnet = lazy(() =>
  import('./PaymentReceiveNumberDialogContent'),
);

function PaymentReceiveNumberDialog({
  dialogName,
  payload = { id: null },
  isOpen,
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
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(PaymentReceiveNumberDialog);
