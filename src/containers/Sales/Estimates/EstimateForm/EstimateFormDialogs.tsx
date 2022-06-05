import React from 'react';
import { useFormikContext } from 'formik';
import EstimateNumberDialog from 'containers/Dialogs/EstimateNumberDialog';

/**
 * Estimate form dialogs.
 */
export default function EstimateFormDialogs() {
  const { setFieldValue } = useFormikContext();

  // Update the form once the invoice number form submit confirm.
  const handleEstimateNumberFormConfirm = ({ incrementNumber, manually }) => {
    setFieldValue('estimate_number', incrementNumber || '');
    setFieldValue('estimate_number_manually', manually);
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
