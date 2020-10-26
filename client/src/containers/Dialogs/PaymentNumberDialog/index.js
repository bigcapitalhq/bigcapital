import React, { lazy } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const PaymentNumbereDialogConetnet = lazy(() =>
  import('./PaymentNumberDialogContent'),
);

function PaymentNumberDialog({ dialogName, payload = { id: null }, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      name={dialogName}
      title={<T id={'payment_number_settings'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <PaymentNumbereDialogConetnet paymentNumberId={payload.id} />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(PaymentNumberDialog);
