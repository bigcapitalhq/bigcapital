import React, { lazy } from 'react';
import type { BranchFormDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const BranchFormDialogContent = lazy(() =>
  import('./BranchFormDialogContent').then((m) => ({
    default: m.BranchFormDialogContent,
  })),
);

interface BranchFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: BranchFormDialogPayload;
}

/**
 * Branch form form dialog.
 */
function BranchFormDialog({
  dialogName,
  payload: { branchId = null, action } = {},
  isOpen,
}: BranchFormDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={
        action === 'edit' ? (
          <T id={'branch.dialog.label_edit_branch'} />
        ) : (
          <T id={'branch.dialog.label_new_branch'} />
        )
      }
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--branch-form'}
    >
      <DialogSuspense testId="branch-form-dialog">
        <BranchFormDialogContent dialogName={dialogName} branchId={branchId} />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(BranchFormDialog);
