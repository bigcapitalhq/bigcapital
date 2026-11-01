import { useFormikContext } from 'formik';
import React from 'react';
import type { ReceiptFormValues } from './utils';
import { DialogsName } from '@/constants/dialogs';
import { index as ReceiptNumberDialog } from '@/containers/Dialogs/ReceiptNumberDialog';
import { InvoiceExchangeRateChangeDialog } from '@/containers/Sales/Invoices/InvoiceForm/Dialogs/InvoiceExchangeRateChangeDialog';

type ReceiptNumberFormSettings = {
  transactionNumber: string;
  incrementMode: string;
};

/**
 * Receipt form dialogs.
 */
export function ReceiptFormDialogs() {
  const { setFieldValue } = useFormikContext<ReceiptFormValues>();

  // Update the form once the receipt number form submit confirm.
  const handleReceiptNumberFormConfirm = (
    settings: ReceiptNumberFormSettings,
  ) => {
    // Set the receipt transaction no. that cames from dialog to the form.
    // the `receipt_no_manually` will be empty except the increment mode is not auto.
    setFieldValue('receiptNumber', settings.transactionNumber);
    setFieldValue('receiptNumberManually', '');

    if (settings.incrementMode !== 'auto') {
      setFieldValue('receiptNumberManually', settings.transactionNumber);
    }
  };

  return (
    <>
      <ReceiptNumberDialog
        dialogName={'receipt-number-form'}
        onConfirm={handleReceiptNumberFormConfirm}
      />
      <InvoiceExchangeRateChangeDialog
        dialogName={DialogsName.InvoiceExchangeRateChangeNotice}
      />
    </>
  );
}
