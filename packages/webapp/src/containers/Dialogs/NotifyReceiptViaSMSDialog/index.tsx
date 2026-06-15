// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const NotifyReceiptViaSMSDialogContent = React.lazy(() =>
  import('./NotifyReceiptViaSMSDialogContent').then((m) => ({
    default: m.NotifyReceiptViaSMSDialogContent,
  })),
);

function NotifyReceiptViaSMSDialog({
  dialogName,
  payload: { receiptId },
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
        <NotifyReceiptViaSMSDialogContent
          dialogName={dialogName}
          receipt={receiptId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(
  NotifyReceiptViaSMSDialog,
);
