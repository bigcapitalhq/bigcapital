import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const NotifyInvoiceViaSMSDialogContent = React.lazy(() =>
  import('./NotifyInvoiceViaSMSDialogContent').then((m) => ({
    default: m.NotifyInvoiceViaSMSDialogContent,
  })),
);

interface NotifyInvoiceViaSMSDialogProps {
  dialogName: string;
  payload: { invoiceId?: number | null };
  isOpen: boolean | undefined;
}

function NotifyInvoiceViaSMSDialog({
  dialogName,
  payload: { invoiceId } = {},
  isOpen,
}: NotifyInvoiceViaSMSDialogProps): React.ReactElement {
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
        <NotifyInvoiceViaSMSDialogContent
          dialogName={dialogName}
          invoiceId={invoiceId ?? null}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(NotifyInvoiceViaSMSDialog);
