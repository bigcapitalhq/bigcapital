import React, { lazy } from 'react';
import type { WarehouseFormDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const WarehouseFormDialogContent = lazy(() =>
  import('./WarehouseFormDialogContent').then((m) => ({
    default: m.WarehouseFormDialogContent,
  })),
);

interface WarehouseFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: WarehouseFormDialogPayload;
}

function WarehouseFormDialog({
  dialogName,
  payload: { warehouseId = null, action } = {},
  isOpen,
}: WarehouseFormDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={
        action === 'edit' ? (
          <T id={'warehouse.dialog.label.edit_warehouse'} />
        ) : (
          <T id={'warehouse.dialog.label.new_warehouse'} />
        )
      }
      isOpen={isOpen}
      canEscapeKeyClose={true}
      autoFocus={true}
      className={'dialog--warehouse-form'}
    >
      <DialogSuspense testId="warehouse-form-dialog">
        <WarehouseFormDialogContent
          dialogName={dialogName}
          warehouseId={warehouseId}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(WarehouseFormDialog);
