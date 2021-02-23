import React from 'react';
import { useFormikContext } from 'formik';
import JournalNumberDialog from 'containers/Dialogs/JournalNumberDialog';
import { transactionNumber } from 'utils';

/**
 * Make journal form dialogs.
 */
export default function MakeJournalFormDialogs() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the journal number form submit confirm.
  const handleConfirm = (values) => {
    setFieldValue(
      'journal_number',
      transactionNumber(values.number_prefix, values.next_number),
    );
  };

  return (
    <>
      <JournalNumberDialog
        dialogName={'journal-number-form'}
        onConfirm={handleConfirm}
      />
    </>
  );
}
