// @ts-nocheck
import React from 'react';

import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const NotifyInvoiceViaSMSDialogContent = React.lazy(() =>
  import('./NotifyInvoiceViaSMSDialogContent').then((m) => ({
    default: m.NotifyInvoiceViaSMSDialogContent,
  })),
);

function NotifyInvoiceViaSMSDialog({
  dialogName,
  payload: { invoiceId },
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
        <NotifyInvoiceViaSMSDialogContent
          dialogName={dialogName}
          invoiceId={invoiceId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(
  NotifyInvoiceViaSMSDialog,
);
