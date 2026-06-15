// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const ExcessPaymentDialogContent = React.lazy(() =>
  import('./PaymentMadeExcessDialogContent').then((module) => ({
    default: module.ExcessPaymentDialogContent,
  })),
);

/**
 * Exess payment dialog of the payment made form.
 */
function ExcessPaymentDialogRoot({ dialogName, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={'Excess Payment'}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      style={{ width: 500 }}
    >
      <DialogSuspense>
        <ExcessPaymentDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const ExcessPaymentDialog = flow(withDialogRedux())(
  ExcessPaymentDialogRoot,
);

ExcessPaymentDialog.displayName = 'ExcessPaymentDialog';
