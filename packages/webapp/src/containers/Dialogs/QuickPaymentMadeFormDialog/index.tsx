// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const QuickPaymentMadeFormDialogContent = lazy(() =>
  import('./QuickPaymentMadeFormDialogContent').then((m) => ({
    default: m.QuickPaymentMadeFormDialogContent,
  })),
);

/**
 * Quick payment made form dialog.
 */
function QuickPaymentMadeFormDialog({
  dialogName,
  payload = { billId: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'quick_made_payment'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--quick-payment-receive'}
    >
      <DialogSuspense>
        <QuickPaymentMadeFormDialogContent
          bill={payload.billId}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(
  QuickPaymentMadeFormDialog,
);
