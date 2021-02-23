import React from 'react';
import { useFormikContext } from 'formik';
import EstimateNumberDialog from 'containers/Dialogs/EstimateNumberDialog';
import { transactionNumber } from 'utils';

/**
 * Estimate form dialogs.
 */
export default function EstimateFormDialogs() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the invoice number form submit confirm.
  const handleEstimateNumberFormConfirm = (values) => {
    setFieldValue(
      'estimate_number',
      transactionNumber(values.number_prefix, values.next_number),
    );
  };

  return (
    <>
      <EstimateNumberDialog
        dialogName={'estimate-number-form'}
        onConfirm={handleEstimateNumberFormConfirm}
      />
    </>
  );
}
