// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

import { compose } from '@/utils';

const BranchFormDialogContent = React.lazy(
  () => import('./BranchFormDialogContent'),
);

/**
 * Branch form dialog.
 */
function BranchFormDialog({
  dialogName,
  payload: { branchId, action },
  isOpen,
}) {
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
      <DialogSuspense>
        <BranchFormDialogContent dialogName={dialogName} branchId={branchId} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(BranchFormDialog);
