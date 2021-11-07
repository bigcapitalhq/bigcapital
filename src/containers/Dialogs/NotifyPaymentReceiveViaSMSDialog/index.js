import React from 'react';
import { FormattedMessage as T } from 'components';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const NotifyPaymentReceiveViaSMSDialogContent = React.lazy(() =>
  import('./NotifyPaymentReceiveViaSMSContent'),
);

function NotifyPaymentReciveViaSMSDialog({
  dialogName,
  payload: { paymentReceiveId },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'notify_via_sms.dialog.notify_via_sms'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--notify-vis-sms'}
    >
      <DialogSuspense>
        <NotifyPaymentReceiveViaSMSDialogContent
          dialogName={dialogName}
          paymnetReceive={paymentReceiveId}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(NotifyPaymentReciveViaSMSDialog);
