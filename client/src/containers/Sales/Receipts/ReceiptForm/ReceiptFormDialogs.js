import React from 'react';
import { useFormikContext } from 'formik';
import ReceiptNumberDialog from 'containers/Dialogs/ReceiptNumberDialog';

/**
 * Receipt form dialogs.
 */
export default function ReceiptFormDialogs() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the receipt number form submit confirm.
  const handleReceiptNumberFormConfirm = ({ incrementNumber, manually }) => {
    setFieldValue('receipt_number', incrementNumber || '');
    setFieldValue('receipt_number_manually', manually);
  };

  return (
    <>
      <ReceiptNumberDialog
        dialogName={'receipt-number-form'}
        onConfirm={handleReceiptNumberFormConfirm}
      />
    </>
  );
}
