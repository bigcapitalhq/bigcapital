import { useFormikContext } from 'formik';
import React from 'react';
import type { MoneyOutFormValues } from './types';
import { index as TransactionNumberDialog } from '@/containers/Dialogs/TransactionNumberDialog';

interface TransactionNumberFormConfirmPayload {
  incrementNumber?: string;
  manually?: string;
}

/**
 * Money out form dialog.
 */
export function MoneyOutFormDialog() {
  const { setFieldValue } = useFormikContext<MoneyOutFormValues>();

  // Update the form once the transaction number form submit confirm.
  const handleTransactionNumberFormConfirm = ({
    incrementNumber,
    manually,
  }: TransactionNumberFormConfirmPayload) => {
    setFieldValue('transactionNumber', incrementNumber || '');
    setFieldValue('transactionNumberManually', manually);
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
