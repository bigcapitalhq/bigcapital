// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik'; 
import WarehouseTransferNumberDialog from '@/containers/Dialogs/WarehouseTransferNumberDialog';

/**
 * Warehouse transfer form dialog.
 */
export default function WarehouseTransferFormDialog() {
  // Update the form once the credit number form submit confirm.
  const handleWarehouseNumberFormConfirm = ({ incrementNumber, manually }) => {
    setFieldValue('transaction_number', incrementNumber || '');
    setFieldValue('transaction_no_manually', manually);
  };

  const { setFieldValue } = useFormikContext();
  return (
    <React.Fragment>
      <WarehouseTransferNumberDialog
        dialogName={'warehouse-transfer-no-form'}
        onConfirm={handleWarehouseNumberFormConfirm}
      />
    </React.Fragment>
  );
}
