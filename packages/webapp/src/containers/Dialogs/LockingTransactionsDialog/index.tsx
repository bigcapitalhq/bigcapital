// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const LockingTransactionsDialogContent = React.lazy(() =>
  import('./LockingTransactionsDialogContent').then((m) => ({
    default: m.LockingTransactionsDialogContent,
  })),
);

/**
 * Locking Transactions dialog
 */
function LockingTransactionsDialog({
  dialogName,
  payload: { module, isEnabled },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      autoFocus={true}
      title={<T id={'locking_transactions.dialog.label'} />}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className={'dialog--transaction--locking'}
    >
      <DialogSuspense>
        <LockingTransactionsDialogContent
          moduleName={module}
          dialogName={dialogName}
          isEnabled={isEnabled}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(
  LockingTransactionsDialog,
);
