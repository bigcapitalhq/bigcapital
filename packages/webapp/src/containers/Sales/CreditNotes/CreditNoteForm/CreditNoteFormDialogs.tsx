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
    setFieldValue('credit_note_number', settings.transactionNumber);
    setFieldValue('credit_note_no_manually', settings.transactionNumber);
  };

  return (
    <CreditNoteNumberDialog
      dialogName={'credit-number-form'}
      onConfirm={handleCreditNumberFormConfirm}
    />
  );
}
