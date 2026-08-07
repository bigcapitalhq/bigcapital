import React, { lazy } from 'react';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const BranchActivateDialogContent = lazy(() =>
  import('./BranchActivateDialogContent').then((m) => ({
    default: m.BranchActivateDialogContent,
  })),
);

interface BranchActivateDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 * Branch activate dialog.
 */
function BranchActivateDialog({
  dialogName,
  payload = {},
  isOpen,
}: BranchActivateDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'branch_activate.dialog.label'} />}
      isOpen={isOpen}
      // FIXME: typo — should be `canEscapeKeyClose`. Left as-is to avoid a
      // behavior change in a TS-only slice.
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

export const index = compose(withDialogRedux())(BranchActivateDialog);
