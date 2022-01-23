import React from 'react';
import { FormattedMessage as T } from 'components';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';

import { compose } from 'utils';

const BranchFormDialogContent = React.lazy(() =>
  import('./BranchFormDialogContent'),
);

/**
 * Branch form form dialog.
 */
function BranchFormDialog({ dialogName, payload = {}, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'branch.dialog.label'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--branch-form'}
    >
      <DialogSuspense>
        <BranchFormDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(BranchFormDialog);
