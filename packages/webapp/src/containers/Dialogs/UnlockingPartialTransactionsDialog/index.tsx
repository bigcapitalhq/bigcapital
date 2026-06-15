// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const UnlockingPartialTransactionsDialogContent = React.lazy(() =>
  import('./UnlockingPartialTransactionsDialogContent').then((m) => ({
    default: m.UnlockingPartialTransactionsDialogContent,
  })),
);

/**
 * UncLocking Partial transactions dialog.
 */
function UnLockingPartialTransactionsDilaog({
  isOpen,
  dialogName,
  payload: { module },
}) {
  return (
    <Dialog
      name={dialogName}
      autoFocus={true}
      title={<T id={'unlocking_partial_transactions.dialog.label'} />}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className={'dialog--transaction--locking'}
    >
      <DialogSuspense>
        <UnlockingPartialTransactionsDialogContent
          moduleName={module}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(
  UnLockingPartialTransactionsDilaog,
);
