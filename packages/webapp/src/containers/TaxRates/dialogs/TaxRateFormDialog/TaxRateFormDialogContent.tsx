// @ts-nocheck
import React from 'react';
import TaxRateFormDialogForm from './TaxRateFormDialogForm';
import { TaxRateFormDialogBoot } from './TaxRateFormDialogBoot';

interface TaxRateFormDialogContentProps {
  dialogName: string;
  taxRateId: number;
}

/**
 * Tax rate form dialog content.
 */
export default function TaxRateFormDialogContent({
  dialogName,
  taxRateId,
}: TaxRateFormDialogContentProps) {
  return (
    <TaxRateFormDialogBoot dialogName={dialogName} taxRateId={taxRateId}>
      <TaxRateFormDialogForm />
    </TaxRateFormDialogBoot>
  );
}
