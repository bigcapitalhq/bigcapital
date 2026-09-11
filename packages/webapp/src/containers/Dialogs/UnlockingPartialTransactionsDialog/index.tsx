import * as FF from 'fp-ts/function';
import React from 'react';
import type { UnlockingPartialTransactionsDialogPayload } from './types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

const UnlockingPartialTransactionsDialogContent = React.lazy(() =>
  import('./UnlockingPartialTransactionsDialogContent').then((m) => ({
    default: m.UnlockingPartialTransactionsDialogContent,
  })),
);

interface UnlockingPartialTransactionsDialogProps {
  dialogName: string;
  payload: UnlockingPartialTransactionsDialogPayload;
  isOpen: boolean | undefined;
}

/**
 * UncLocking Partial transactions dialog.
 */
function UnLockingPartialTransactionsDilaog({
  isOpen,
  dialogName,
  payload: { module } = {},
}: UnlockingPartialTransactionsDialogProps): React.ReactElement {
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
          moduleName={module ?? ''}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = FF.pipe(
  UnLockingPartialTransactionsDilaog,
  withDialogRedux(),
);
