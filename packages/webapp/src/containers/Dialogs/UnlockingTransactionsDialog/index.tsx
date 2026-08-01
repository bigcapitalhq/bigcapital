import React from 'react';
import type { UnlockingTransactionsDialogPayload } from './types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const UnlockingTransactionsDialogContent = React.lazy(() =>
  import('./UnlockingTransactionsDialogContent').then((m) => ({
    default: m.UnlockingTransactionsDialogContent,
  })),
);

interface UnlockingTransactionsDialogProps {
  dialogName: string;
  payload: UnlockingTransactionsDialogPayload;
  isOpen: boolean | undefined;
}

/**
 * Unlocking transactions dialog.
 */
function UnlockingTransactionsDialog({
  dialogName,
  payload: { module } = {},
  isOpen,
}: UnlockingTransactionsDialogProps): React.ReactElement {
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
          moduleName={module ?? ''}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(UnlockingTransactionsDialog);
