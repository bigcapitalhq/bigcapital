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
    setFieldValue('journal_number', settings.transactionNumber);
    setFieldValue('journal_number_manually', settings.transactionNumber);
  };

  return (
    <JournalNumberDialog
      dialogName={'journal-number-form'}
      onConfirm={handleConfirm}
    />
  );
}
