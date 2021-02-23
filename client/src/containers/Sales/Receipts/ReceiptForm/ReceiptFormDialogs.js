import React from 'react';
import { useFormikContext } from 'formik';
import ReceiptNumberDialog from 'containers/Dialogs/ReceiptNumberDialog';
import { transactionNumber } from 'utils';

/**
 * Receipt form dialogs.
 */
export default function ReceiptFormDialogs() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the receipt number form submit confirm.
  const handleReceiptNumberFormConfirm = (values) => {
    setFieldValue(
      'receipt_number',
      transactionNumber(values.number_prefix, values.next_number),
    );
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
