import React, { lazy } from 'react';
import type { InventoryAdjustmentDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

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
  payload = { action: '', itemId: null },
  isOpen,
}: InventoryAdjustmentFormDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'make_adjustment'} />}
      isOpen={isOpen}
      canEscapeKeyClose={true}
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

export const index = compose(withDialogRedux())(InventoryAdjustmentFormDialog);
