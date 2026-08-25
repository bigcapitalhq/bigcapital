import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const NotifyPaymentReceiveViaSMSDialogContent = React.lazy(() =>
  import('./NotifyPaymentReceiveViaSMSContent').then((m) => ({
    default: m.NotifyPaymentReceiveViaSMSContent,
  })),
);

interface NotifyPaymentReceiveViaSMSDialogProps {
  dialogName: string;
  payload: { paymentReceiveId?: number | null };
  isOpen: boolean | undefined;
}

function NotifyPaymentReciveViaSMSDialog({
  dialogName,
  payload: { paymentReceiveId } = {},
  isOpen,
}: NotifyPaymentReceiveViaSMSDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'notify_via_sms.dialog.notify_via_sms'} />}
      isOpen={isOpen}
      // FIXME: typo — should be `canEscapeKeyClose`. Left as-is to avoid a
      // behavior change in a TS-only slice.
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--notify-vis-sms'}
    >
      <DialogSuspense>
        <NotifyPaymentReceiveViaSMSDialogContent
          dialogName={dialogName}
          paymentReceive={paymentReceiveId ?? null}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(
  NotifyPaymentReciveViaSMSDialog,
);
