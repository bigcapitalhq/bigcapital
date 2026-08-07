import { useFormikContext } from 'formik';
import React from 'react';
import { index as WarehouseTransferNumberDialog } from '@/containers/Dialogs/WarehouseTransferNumberDialog';

interface WarehouseTransferNumberDialogResult {
  incrementNumber?: number | string;
  manually?: boolean;
}

/**
 * Warehouse transfer form dialog.
 */
export function WarehouseTransferFormDialog() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the credit number form submit confirm.
  const handleWarehouseNumberFormConfirm = ({
    incrementNumber,
    manually,
  }: WarehouseTransferNumberDialogResult) => {
    setFieldValue('transactionNumber', incrementNumber || '');
    setFieldValue('transaction_no_manually', manually);
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
