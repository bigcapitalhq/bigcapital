// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const LockingTransactionsDialogContent = React.lazy(() =>
  import('./LockingTransactionsDialogContent'),
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

export default compose(withDialogRedux())(LockingTransactionsDialog);
