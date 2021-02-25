import React from 'react';
import InvoiceNumberDialog from 'containers/Dialogs/InvoiceNumberDialog';
import { useFormikContext } from 'formik';
import { transactionNumber } from 'utils';

/**
 * Invoice form dialogs.
 */
export default function InvoiceFormDialogs() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the invoice number form submit confirm.
  const handleInvoiceNumberFormConfirm = (values) => {
    debugger;
    console.log(values, 'XX');

    setFieldValue(
      'invoice_no',
      transactionNumber(values.number_prefix, values.next_number),
    );
  };
  return (
    <>
      <InvoiceNumberDialog
        dialogName={'invoice-number-form'}
        onConfirm={handleInvoiceNumberFormConfirm}
      />
    </>
  );
}
