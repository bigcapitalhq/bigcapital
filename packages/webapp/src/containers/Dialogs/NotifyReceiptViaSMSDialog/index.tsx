import React from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const NotifyReceiptViaSMSDialogContent = React.lazy(() =>
  import('./NotifyReceiptViaSMSDialogContent').then((m) => ({
    default: m.NotifyReceiptViaSMSDialogContent,
  })),
);

interface NotifyReceiptViaSMSDialogProps {
  dialogName: string;
  payload: { receiptId?: number | null };
  isOpen: boolean | undefined;
}

function NotifyReceiptViaSMSDialog({
  dialogName,
  payload: { receiptId } = {},
  isOpen,
}: NotifyReceiptViaSMSDialogProps): React.ReactElement {
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
        <NotifyReceiptViaSMSDialogContent
          dialogName={dialogName}
          receipt={receiptId ?? null}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(NotifyReceiptViaSMSDialog);
