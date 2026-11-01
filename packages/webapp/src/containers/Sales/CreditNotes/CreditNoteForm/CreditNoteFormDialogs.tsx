import { useFormikContext } from 'formik';
import React from 'react';
import type { CreditNoteFormValues } from './utils';
import { DialogsName } from '@/constants/dialogs';
import { index as CreditNoteNumberDialog } from '@/containers/Dialogs/CreditNoteNumberDialog';
import { InvoiceExchangeRateChangeDialog } from '@/containers/Sales/Invoices/InvoiceForm/Dialogs/InvoiceExchangeRateChangeDialog';

type CreditNoteNumberSettings = {
  transactionNumber: string;
  incrementMode: string;
};

/**
 * Credit note form dialogs.
 */
export function CreditNoteFormDialogs() {
  const { setFieldValue } = useFormikContext<CreditNoteFormValues>();

  // Update the form once the credit number form submit confirm.
  const handleCreditNumberFormConfirm = (
    settings: CreditNoteNumberSettings,
  ) => {
    // Set the credit note transaction no. that cames from dialog to the form.
    // the `creditNoteNumber` will be empty except the increment mode is not auto.
    setFieldValue('creditNoteNumber', settings.transactionNumber);
    setFieldValue('creditNoteNumberManually', '');

    if (settings.incrementMode !== 'auto') {
      setFieldValue('creditNoteNumberManually', settings.transactionNumber);
    }
  };

  return (
    <>
      <CreditNoteNumberDialog
        dialogName={'credit-number-form'}
        onConfirm={handleCreditNumberFormConfirm}
      />
      <InvoiceExchangeRateChangeDialog
        dialogName={DialogsName.InvoiceExchangeRateChangeNotice}
      />
    </>
  );
}
