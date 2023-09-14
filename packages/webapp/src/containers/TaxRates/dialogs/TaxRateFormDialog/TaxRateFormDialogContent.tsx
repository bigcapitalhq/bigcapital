// @ts-nocheck
import React from 'react';
import TaxRateFormDialogForm from './TaxRateFormDialogForm';
import { TaxRateFormDialogBoot } from './TaxRateFormDialogBoot';

/**
 * Account dialog content.
 */
export default function TaxRateFormDialogContent({ dialogName, payload }) {
  return (
    <TaxRateFormDialogBoot dialogName={dialogName} payload={payload}>
      <TaxRateFormDialogForm />
    </TaxRateFormDialogBoot>
  );
}
