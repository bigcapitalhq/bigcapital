// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';

import TransactionNumberDialog from '@/containers/Dialogs/TransactionNumberDialog';

/**
 * Money in / transaction number form dialog.
 */
export default function MoneyInFormDialog() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the transaction number form submit confirm.
  const handleTransactionNumberFormConfirm = (settings) => {
    setFieldValue('transaction_number', settings.transactionNumber);
    setFieldValue('transaction_number_manually', settings.transactionNumber);
  };
  return (
    <React.Fragment>
      <TransactionNumberDialog
        dialogName={'transaction-number-form'}
        onConfirm={handleTransactionNumberFormConfirm}
      />
    </React.Fragment>
  );
}
