// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const WarehouseActivateDialogContent = React.lazy(() =>
  import('./WarehouseActivateDialogContent').then((m) => ({
    default: m.WarehouseActivateDialogContent,
  })),
);

/**
 * Warehouse activate dialog.
 */
function WarehouseActivateDialog({ dialogName, payload: {}, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'warehouse_activate.dialog.label'} />}
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

export const index = flow(withDialogRedux())(WarehouseActivateDialog);
