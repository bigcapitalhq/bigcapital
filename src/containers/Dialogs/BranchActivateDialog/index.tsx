// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

import { compose } from '@/utils';

const BranchActivateDialogContent = React.lazy(
  () => import('./BranchActivateDialogContent'),
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

export default compose(withDialogRedux())(BranchActivateDialog);
