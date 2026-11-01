import { useFormikContext } from 'formik';
import React from 'react';
import type { EstimateFormValues } from './utils';
import { DialogsName } from '@/constants/dialogs';
import { index as EstimateNumberDialog } from '@/containers/Dialogs/EstimateNumberDialog';
import { InvoiceExchangeRateChangeDialog } from '@/containers/Sales/Invoices/InvoiceForm/Dialogs/InvoiceExchangeRateChangeDialog';

type EstimateNumberSettings = {
  transactionNumber: string;
  incrementMode: string;
};

/**
 * Estimate form dialogs.
 */
export function EstimateFormDialogs() {
  const { setFieldValue } = useFormikContext<EstimateFormValues>();

  // Update the form once the estimate number form submit confirm.
  const handleEstimateNumberFormConfirm = (
    settings: EstimateNumberSettings,
  ) => {
    setFieldValue('estimateNumber', settings.transactionNumber);
    setFieldValue('estimateNumberManually', '');

    if (settings.incrementMode !== 'auto') {
      setFieldValue('estimateNumberManually', settings.transactionNumber);
    }
  };

  return (
    <>
      <EstimateNumberDialog
        dialogName={'estimate-number-form'}
        onConfirm={handleEstimateNumberFormConfirm}
      />
      <InvoiceExchangeRateChangeDialog
        dialogName={DialogsName.InvoiceExchangeRateChangeNotice}
      />
    </>
  );
}
