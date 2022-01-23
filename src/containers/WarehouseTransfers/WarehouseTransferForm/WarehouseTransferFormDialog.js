import React from 'react';
import WarehouseTransferNumberDialog from '../../Dialogs/WarehouseTransferNumberDialog';
import { useFormikContext } from 'formik';

/**
 * Warehouse transfer form dialog.
 */
export default function WarehouseTransferFormDialog() {
  // Update the form once the credit number form submit confirm.
  const handleWarehouseNumberFormConfirm = ({ incrementNumber, manually }) => {
    setFieldValue('transfer_no', incrementNumber || '');
    setFieldValue('transfer_no_manually', manually);
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
