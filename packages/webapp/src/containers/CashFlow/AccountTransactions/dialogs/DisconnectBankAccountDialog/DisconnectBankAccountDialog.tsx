import * as FF from 'fp-ts/function';
import React from 'react';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

const DisconnectBankAccountDialogContent = React.lazy(() =>
  import('./DisconnectBankAccountDialogContent').then((m) => ({
    default: m.DisconnectBankAccountDialogContent as React.ComponentType<{
      dialogName?: string;
      bankAccountId: number;
    }>,
  })),
);

interface DisconnectBankAccountDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 * Disconnect bank account confirmation dialog.
 */
function DisconnectBankAccountDialogRoot({
  dialogName,
  payload,
  isOpen,
}: DisconnectBankAccountDialogProps) {
  const bankAccountId = payload?.bankAccountId as number;

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

export const DisconnectBankAccountDialog = FF.pipe(
  DisconnectBankAccountDialogRoot,
  withDialogRedux(),
);

DisconnectBankAccountDialog.displayName = 'DisconnectBankAccountDialog';
