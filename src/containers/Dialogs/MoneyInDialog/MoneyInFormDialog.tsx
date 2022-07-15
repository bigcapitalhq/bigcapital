import React from 'react';
import { useFormikContext } from 'formik';

import TransactionNumberDialog from '@/containers/Dialogs/TransactionNumberDialog';

/**
 * Moneny in / transaction number form dialog.
 */
export default function MoneyInFormDialog() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the transaction number form submit confirm.
  const handleTransactionNumberFormConfirm = ({
    incrementNumber,
    manually,
  }) => {
    setFieldValue('transaction_number', incrementNumber || '');
    setFieldValue('transaction_number_manually', manually);
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
