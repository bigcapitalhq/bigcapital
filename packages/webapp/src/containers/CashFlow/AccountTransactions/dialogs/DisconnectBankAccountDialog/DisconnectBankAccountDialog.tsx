// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const DisconnectBankAccountDialogContent = React.lazy(() =>
  import('./DisconnectBankAccountDialogContent').then((m) => ({
    default: m.DisconnectBankAccountDialogContent,
  })),
);

/**
 * Disconnect bank account confirmation dialog.
 */
function DisconnectBankAccountDialogRoot({
  dialogName,
  payload: { bankAccountId },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={'Disconnect Bank Account'}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      style={{ width: 400 }}
    >
      <DialogSuspense>
        <DisconnectBankAccountDialogContent
          dialogName={dialogName}
          bankAccountId={bankAccountId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const DisconnectBankAccountDialog = flow(withDialogRedux())(
  DisconnectBankAccountDialogRoot,
);

DisconnectBankAccountDialog.displayName = 'DisconnectBankAccountDialog';
