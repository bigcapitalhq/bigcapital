// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const NotifyPaymentReceiveViaSMSDialogContent = React.lazy(() =>
  import('./NotifyPaymentReceiveViaSMSContent').then((m) => ({
    default: m.NotifyPaymentReceiveViaSMSContent,
  })),
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
          paymentReceive={paymentReceiveId}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = flow(withDialogRedux())(
  NotifyPaymentReciveViaSMSDialog,
);
