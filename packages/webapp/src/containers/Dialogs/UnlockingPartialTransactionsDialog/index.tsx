// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const UnlockingPartialTransactionsDialogContent = React.lazy(() =>
  import('./UnlockingPartialTransactionsDialogContent'),
);

/**
 * UncLocking Partial transactions dialog.
 */
function UnLockingPartialTransactionsDialog({
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

export default compose(withDialogRedux())(UnLockingPartialTransactionsDialog);
