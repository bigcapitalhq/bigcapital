// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const UnlockingTransactionsDialogContent = React.lazy(() =>
  import('./UnlockingTransactionsDialogContent'),
);

/**
 * Unlocking transactions dialog.
 */
function UnlockingTransactionsDialog({
  dialogName,
  payload: { module },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      autoFocus={true}
      title={<T id={'unlocking_transactions.dialog.label'} />}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className={'dialog--transaction--locking'}
    >
      <DialogSuspense>
        <UnlockingTransactionsDialogContent
          moduleName={module}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(UnlockingTransactionsDialog);
