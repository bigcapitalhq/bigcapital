import React, { lazy } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'redux';

const InventoryAdjustmentFormDialogContent = lazy(() =>
  import('./InventoryAdjustmentFormDialogContent'),
);

/**
 * Inventory adjustments form dialog.
 */
function InventoryAdjustmentFormDialog({
  dialogName,
  payload = { action: '', id: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'make_adjustment'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
    >
      <DialogSuspense>
        <InventoryAdjustmentFormDialogContent
          dialogName={dialogName}
          action={payload.action}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(InventoryAdjustmentFormDialog);
