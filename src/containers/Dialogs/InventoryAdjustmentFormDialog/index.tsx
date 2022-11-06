// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const InventoryAdjustmentFormDialogContent = lazy(
  () => import('./InventoryAdjustmentFormDialogContent'),
);

/**
 * Inventory adjustments form dialog.
 */
function InventoryAdjustmentFormDialog({
  dialogName,
  payload = { action: '', itemId: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'make_adjustment'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--adjustment-item'}
    >
      <DialogSuspense>
        <InventoryAdjustmentFormDialogContent
          dialogName={dialogName}
          itemId={payload.itemId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(InventoryAdjustmentFormDialog);
