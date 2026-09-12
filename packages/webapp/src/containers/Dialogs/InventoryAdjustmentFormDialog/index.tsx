import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import type { InventoryAdjustmentDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

const InventoryAdjustmentFormDialogContent = lazy(() =>
  import('./InventoryAdjustmentFormDialogContent').then((m) => ({
    default: m.InventoryAdjustmentFormDialogContent,
  })),
);

interface InventoryAdjustmentFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: InventoryAdjustmentDialogPayload;
}

function InventoryAdjustmentFormDialog({
  dialogName,
  payload = { action: '', itemId: null, inventoryId: null },
  isOpen,
}: InventoryAdjustmentFormDialogProps): React.ReactElement {
  const isEditMode = payload.action === 'edit' && !!payload.inventoryId;

  return (
    <Dialog
      name={dialogName}
      title={<T id={isEditMode ? 'edit_adjustment' : 'make_adjustment'} />}
      isOpen={isOpen}
      canEscapeKeyClose={true}
      autoFocus={true}
      className={'dialog--adjustment-item'}
    >
      <DialogSuspense>
        <InventoryAdjustmentFormDialogContent
          dialogName={dialogName}
          itemId={payload.itemId}
          inventoryId={payload.inventoryId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = FF.pipe(InventoryAdjustmentFormDialog, withDialogRedux());
