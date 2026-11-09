import { TaxRateFormDialogBoot } from './TaxRateFormDialogBoot';
import { TaxRateFormDialogForm } from './TaxRateFormDialogForm';

interface TaxRateFormDialogContentProps {
  dialogName: string;
  taxRateId: number;
}

/**
 * Tax rate form dialog content.
 */
export function TaxRateFormDialogContent({
  dialogName,
  taxRateId,
}: TaxRateFormDialogContentProps) {
  return (
    <TaxRateFormDialogBoot dialogName={dialogName} taxRateId={taxRateId}>
      <TaxRateFormDialogForm />
    </TaxRateFormDialogBoot>
  );
}
