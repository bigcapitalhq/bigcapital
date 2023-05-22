// @ts-nocheck
import React from 'react';
import InvoiceNumberDialog from '@/containers/Dialogs/InvoiceNumberDialog';
import { useFormikContext } from 'formik';
import { DialogsName } from '@/constants/dialogs';

/**
 * Invoice form dialogs.
 */
export default function InvoiceFormDialogs() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the invoice number form submit confirm.
  const handleInvoiceNumberFormConfirm = (settings) => {
    setFieldValue('invoice_no', settings.transactionNumber);
    setFieldValue('invoice_no_manually', settings.transactionNumber);
  };

  return (
    <InvoiceNumberDialog
      dialogName={DialogsName.InvoiceNumberSettings}
      onConfirm={handleInvoiceNumberFormConfirm}
    />
  );
}
