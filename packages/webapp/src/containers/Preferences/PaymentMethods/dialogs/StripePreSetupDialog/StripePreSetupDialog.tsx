// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { StripePreSetupDialogContent } from './StripePreSetupDialogContent';
import { flow } from 'fp-ts/function';

/**
 * Select payment methods dialogs.
 */
function StripePreSetupDialogRoot({ dialogName, payload, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      isOpen={isOpen}
      payload={payload}
      title={'Connect a Stripe account to accept card payments'}
      canEscapeJeyClose={true}
      autoFocus={true}
      style={{ width: 500 }}
    >
      <DialogSuspense>
        <StripePreSetupDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const StripePreSetupDialog = flow(withDialogRedux())(
  StripePreSetupDialogRoot,
);

StripePreSetupDialogRoot.displayName = 'StripePreSetupDialog';
