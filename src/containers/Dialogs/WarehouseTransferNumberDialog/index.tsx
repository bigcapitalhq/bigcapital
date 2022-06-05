import React from 'react';
import { FormattedMessage as T } from 'components';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose, saveInvoke } from 'utils';

const WarehouseTransferNumberDialogContent = React.lazy(() =>
  import('./WarehouseTransferNumberDialogContent'),
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
export default compose(withDialogRedux())(WarehouseTransferNumberDilaog);
