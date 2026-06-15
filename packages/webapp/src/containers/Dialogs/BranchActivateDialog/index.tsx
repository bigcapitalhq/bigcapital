// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const BranchActivateDialogContent = React.lazy(() =>
  import('./BranchActivateDialogContent').then((m) => ({
    default: m.BranchActivateDialogContent,
  })),
);

/**
 * Branch activate dialog.
 */
function BranchActivateDialog({ dialogName, payload: {}, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'branch_activate.dialog.label'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--branch-activate'}
    >
      <DialogSuspense>
        <BranchActivateDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(BranchActivateDialog);
