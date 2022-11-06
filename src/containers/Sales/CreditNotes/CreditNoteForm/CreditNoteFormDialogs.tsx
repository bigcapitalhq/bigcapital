// @ts-nocheck
import React from 'react';
import CreditNoteNumberDialog from '@/containers/Dialogs/CreditNoteNumberDialog';
import { useFormikContext } from 'formik';

/**
 * Credit note form dialogs.
 */
export default function CreditNoteFormDialogs() {
  // Update the form once the credit number form submit confirm.
  const handleCreditNumberFormConfirm = ({ incrementNumber, manually }) => {
    setFieldValue('credit_note_number', incrementNumber || '');
    setFieldValue('credit_note_no_manually', manually);
  };

  const { setFieldValue } = useFormikContext();
  return (
    <React.Fragment>
      <CreditNoteNumberDialog
        dialogName={'credit-number-form'}
        onConfirm={handleCreditNumberFormConfirm}
      />
    </React.Fragment>
  );
}
