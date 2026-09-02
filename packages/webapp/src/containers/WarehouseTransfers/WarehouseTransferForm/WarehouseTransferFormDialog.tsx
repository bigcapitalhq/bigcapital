import { useFormikContext } from 'formik';
import React from 'react';
import { index as WarehouseTransferNumberDialog } from '@/containers/Dialogs/WarehouseTransferNumberDialog';

interface WarehouseTransferNumberDialogResult {
  incrementNumber?: number | string;
}

/**
 * Warehouse transfer form dialog.
 */
export function WarehouseTransferFormDialog() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the credit number form submit confirm.
  const handleWarehouseNumberFormConfirm = ({
    incrementNumber,
  }: WarehouseTransferNumberDialogResult) => {
    setFieldValue('transactionNumber', incrementNumber || '');
  };

  return (
    <React.Fragment>
      <WarehouseTransferNumberDialog
        dialogName={'warehouse-transfer-no-form'}
        onConfirm={handleWarehouseNumberFormConfirm}
      />
    </React.Fragment>
  );
}
