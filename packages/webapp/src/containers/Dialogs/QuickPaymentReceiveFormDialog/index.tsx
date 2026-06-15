// @ts-nocheck
import React, { lazy } from 'react';

import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const QuickPaymentReceiveFormDialogContent = lazy(() =>
  import('./QuickPaymentReceiveFormDialogContent').then((m) => ({
    default: m.QuickPaymentReceiveFormDialogContent,
  })),
);

/**
 * Quick payment receive form dialog.
 */
function QuickPaymentReceiveFormDialog({
  dialogName,
  payload = { invoiceId: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'quick_receive_payment'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--quick-payment-receive'}
    >
      <DialogSuspense>
        <QuickPaymentReceiveFormDialogContent
          dialogName={dialogName}
          invoice={payload.invoiceId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(
  QuickPaymentReceiveFormDialog,
);
