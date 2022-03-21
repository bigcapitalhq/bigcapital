import React from 'react';
import { FormattedMessage as T } from 'components';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';

import { compose } from 'utils';

const WarehouseActivateDialogContent = React.lazy(() =>
  import('./WarehouseActivateDialogContent'),
);

/**
 * Warehouse activate dialog.
 */
function WarehouseActivateDialog({ dialogName, payload: {}, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'warehouse_actviate.dialog.label'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--warehouse-activate'}
    >
      <DialogSuspense>
        <WarehouseActivateDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(WarehouseActivateDialog);
