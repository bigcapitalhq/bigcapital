// @ts-nocheck
import React, { useState } from 'react';
import { DialogContent } from '@/components';
import { useTaxRates } from '@/hooks/query/taxRates';

const TaxRateFormDialogContext = React.createContext();

/**
 * Money in dialog provider.
 */
function TaxRateFormDialogBoot({ ...props }) {
  const {
    data: taxRates,
    isLoading: isTaxRatesLoading,
    isSuccess: isTaxRatesSuccess,
  } = useTaxRates({});

  // Provider data.
  const provider = {
    taxRates,
    isTaxRatesLoading,
    isTaxRatesSuccess,
  };

  const isLoading = isTaxRatesLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <TaxRateFormDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useTaxRateFormDialogContext = () =>
  React.useContext(TaxRateFormDialogContext);

export { TaxRateFormDialogBoot, useTaxRateFormDialogContext };
