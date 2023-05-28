// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import JournalNumberDialog from '@/containers/Dialogs/JournalNumberDialog';

/**
 * Make journal form dialogs.
 */
export default function MakeJournalFormDialogs() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the journal number form submit confirm.
  const handleConfirm = (settings) => {
    // Set the invoice transaction no. that cames from dialog to the form.
    // the `journal_number` will be empty except the increment mode is not auto.
    setFieldValue('journal_number', settings.transactionNumber);
    setFieldValue('journal_number_manually', '');

    if (settings.incrementMode !== 'auto') {
      setFieldValue('journal_number_manually', settings.transactionNumber);
    }
  };

  return (
    <JournalNumberDialog
      dialogName={'journal-number-form'}
      onConfirm={handleConfirm}
    />
  );
}
