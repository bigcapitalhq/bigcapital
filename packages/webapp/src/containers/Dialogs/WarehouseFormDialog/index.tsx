// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

import { compose } from '@/utils';

const WarehouseFormDialogContent = React.lazy(
  () => import('./WarehouseFormDialogContent'),
);

/**
 * Warehouse form dialog.
 */
function WarehouseFormDialog({
  dialogName,
  payload: { warehouseId = null, action },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={
        action == 'edit' ? (
          <T id={'warehouse.dialog.label.edit_warehouse'} />
        ) : (
          <T id={'warehouse.dialog.label.new_warehouse'} />
        )
      }
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--warehouse-form'}
    >
      <DialogSuspense>
        <WarehouseFormDialogContent
          dialogName={dialogName}
          warehouseId={warehouseId}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(WarehouseFormDialog);
