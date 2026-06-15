// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke } from '@/utils';
import { flow } from 'fp-ts/function';

const WarehouseTransferNumberDialogContent = React.lazy(() =>
  import('./WarehouseTransferNumberDialogContent').then((m) => ({
    default: m.WarehouseTransferNumberDialogContent,
  })),
);

/**
 * Warehouse transfer number dialog.
 */
function WarehouseTransferNumberDilaog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
}) {
  const handleConfirm = (values) => {
    saveInvoke(onConfirm, values);
  };
  return (
    <Dialog
      title={<T id={'warehouse_transfer_no_settings'} />}
      name={dialogName}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <WarehouseTransferNumberDialogContent
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = flow(withDialogRedux())(
  WarehouseTransferNumberDilaog,
);
