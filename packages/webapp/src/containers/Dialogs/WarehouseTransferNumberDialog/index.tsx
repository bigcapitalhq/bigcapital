import React, { lazy } from 'react';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
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
  payload: { initialFormValues?: Partial<ReferenceNumberFormValues> };
  isOpen: boolean | undefined;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

function WarehouseTransferNumberDilaog({
  dialogName,
  payload: { initialFormValues } = {},
  isOpen,
  onConfirm,
}: WarehouseTransferNumberDialogProps): React.ReactElement {
  const handleConfirm = (values: ReferenceNumberFormValues) => {
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
          // @ts-expect-error — compose()-wrapped component loses generic prop inference.
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(WarehouseTransferNumberDilaog);
