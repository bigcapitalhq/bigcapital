import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose, saveInvoke } from '@/utils';

const WarehouseTransferNumberDialogContent = lazy(() =>
  import('./WarehouseTransferNumberDialogContent').then((m) => ({
    default: m.WarehouseTransferNumberDialogContent,
  })),
);

interface WarehouseTransferNumberDialogProps {
  dialogName: string;
  payload: { initialFormValues?: Record<string, unknown> };
  isOpen: boolean | undefined;
  onConfirm?: (values: Record<string, unknown>) => void;
}

function WarehouseTransferNumberDilaog({
  dialogName,
  payload: { initialFormValues } = {},
  isOpen,
  onConfirm,
}: WarehouseTransferNumberDialogProps): React.ReactElement {
  const handleConfirm = (values: Record<string, unknown>) => {
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
          // @ts-expect-error — HOC-composed component loses generic props via compose; runtime passes through.
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(WarehouseTransferNumberDilaog);
