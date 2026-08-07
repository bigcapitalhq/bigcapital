import { useFormikContext } from 'formik';
import React from 'react';
import type { MakeJournalFormValues } from './utils';
import { index as JournalNumberDialog } from '@/containers/Dialogs/JournalNumberDialog';

type JournalNumberDialogSettings = {
  transactionNumber?: string;
  incrementMode?: 'auto' | 'manual-transaction';
};

/**
 * Make journal form dialogs.
 */
export function MakeJournalFormDialogs() {
  const { setFieldValue } = useFormikContext<MakeJournalFormValues>();

  // Update the form once the journal number form submit confirm.
  const handleConfirm = (settings: JournalNumberDialogSettings) => {
    // Set the journal transaction no. that came from dialog to the form.
    // the `journalNumber` will be empty except the increment mode is not auto.
    setFieldValue('journalNumber', settings.transactionNumber);
    setFieldValue('journalNumberManually', '');

    if (settings.incrementMode !== 'auto') {
      setFieldValue('journalNumberManually', settings.transactionNumber);
    }
  };

  return (
    <JournalNumberDialog
      dialogName={'journal-number-form'}
      onConfirm={handleConfirm}
    />
  );
}
