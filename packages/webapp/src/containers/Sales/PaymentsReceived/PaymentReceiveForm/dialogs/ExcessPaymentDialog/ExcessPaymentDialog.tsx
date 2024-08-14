// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ExcessPaymentDialogContent = React.lazy(() =>
  import('./ExcessPaymentDialogContent').then((module) => ({
    default: module.ExcessPaymentDialogContent,
  })),
);

/**
 * Excess payment dialog of the payment received form.
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

export const ExcessPaymentDialog = compose(withDialogRedux())(
  ExcessPaymentDialogRoot,
);

ExcessPaymentDialog.displayName = 'ExcessPaymentDialog';
