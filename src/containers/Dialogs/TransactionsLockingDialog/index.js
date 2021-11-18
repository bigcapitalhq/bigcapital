import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const TransactionsLockingContent = React.lazy(() =>
  import('./TransactionsLockingDialogContent'),
);

/**
 * Transaction Locking dialog
 */
function TransactionsLockingDialog({ dialogName, payload = {}, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      autoFocus={true}
      title={<T id={'transactions_locking.dialog.label'} />}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className={'dialog--transaction--locking'}
    >
      <DialogSuspense>
        <TransactionsLockingContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(TransactionsLockingDialog);
