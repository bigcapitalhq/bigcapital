import React from 'react';
import { FormattedMessage as T } from 'components';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';

import { compose } from 'utils';

const WarehouseFormDialogContent = React.lazy(() =>
  import('./WarehouseFormDialogContent'),
);

/**
 * Warehouse form form dialog.
 */
function WarehouseFormDialog({ dialogName, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'warehouse.dialog.label'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--warehouse-form'}
    >
      <DialogSuspense>
        <WarehouseFormDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(WarehouseFormDialog);
