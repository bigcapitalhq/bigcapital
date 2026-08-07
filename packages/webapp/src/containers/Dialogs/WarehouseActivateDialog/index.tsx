import React, { lazy } from 'react';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const WarehouseActivateDialogContent = lazy(() =>
  import('./WarehouseActivateDialogContent').then((m) => ({
    default: m.WarehouseActivateDialogContent,
  })),
);

interface WarehouseActivateDialogProps extends DialogBaseProps {
  dialogName: string;
}

function WarehouseActivateDialog({
  dialogName,
  payload = {},
  isOpen,
}: WarehouseActivateDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'warehouse_activate.dialog.label'} />}
      isOpen={isOpen}
      canEscapeKeyClose={true}
      autoFocus={true}
      className={'dialog--warehouse-activate'}
    >
      <DialogSuspense>
        <WarehouseActivateDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(WarehouseActivateDialog);
