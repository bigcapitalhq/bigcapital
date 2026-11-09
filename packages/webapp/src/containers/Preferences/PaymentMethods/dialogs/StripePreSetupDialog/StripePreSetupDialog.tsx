import * as FF from 'fp-ts/function';
import React from 'react';
import { StripePreSetupDialogContent } from './StripePreSetupDialogContent';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux, {
  type DialogBaseProps,
} from '@/components/DialogReduxConnect';

interface StripePreSetupDialogRootProps {
  dialogName: string;
}

type StripePreSetupDialogRootConnectedProps = StripePreSetupDialogRootProps &
  DialogBaseProps;

/**
 * Select payment methods dialogs.
 */
function StripePreSetupDialogRoot({
  dialogName,
  payload,
  isOpen,
}: StripePreSetupDialogRootConnectedProps) {
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

export const StripePreSetupDialog = FF.pipe(
  StripePreSetupDialogRoot,
  withDialogRedux(),
);

StripePreSetupDialogRoot.displayName = 'StripePreSetupDialog';
