// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import CreditNoteNumberDialog from '@/containers/Dialogs/CreditNoteNumberDialog';

/**
 * Credit note form dialogs.
 */
export default function CreditNoteFormDialogs() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the credit number form submit confirm.
  const handleCreditNumberFormConfirm = (settings) => {
    // Set the credit note transaction no. that cames from dialog to the form.
    // the `credit_note_number` will be empty except the increment mode is not auto.
    setFieldValue('credit_note_number', settings.transactionNumber);
    setFieldValue('credit_note_number_manually', '');

    if (settings.incrementMode !== 'auto') {
      setFieldValue('credit_note_number_manually', settings.transactionNumber);
    }
  };

  return (
    <CreditNoteNumberDialog
      dialogName={'credit-number-form'}
      onConfirm={handleCreditNumberFormConfirm}
    />
  );
}
