import { createContext, ReactNode, useContext } from 'react';
import type { TaxRate } from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { useTaxRate } from '@/hooks/query/tax-rates';

export interface TaxRateFormDialogBootContext {
  taxRateId: number;
  taxRate: TaxRate | undefined;
  isTaxRateLoading: boolean;
  isTaxRateSuccess: boolean;
  isNewMode: boolean;
  dialogName: string;
}

export interface TaxRateFormDialogBootProps {
  taxRateId: number;
  dialogName: string;
  children?: ReactNode;
}

const TaxRateFormDialogContext = createContext<
  TaxRateFormDialogBootContext | undefined
>(undefined);

/**
 * Money in dialog provider.
 */
function TaxRateFormDialogBoot({
  taxRateId,
  dialogName,
  ...props
}: TaxRateFormDialogBootProps) {
  const {
    data: taxRate,
    isLoading: isTaxRateLoading,
    isSuccess: isTaxRateSuccess,
  } = useTaxRate(taxRateId, {
    enabled: !!taxRateId,
  });

  const isNewMode = !taxRateId;

  // Provider data.
  const provider: TaxRateFormDialogBootContext = {
    taxRateId,
    taxRate,
    isTaxRateLoading,
    isTaxRateSuccess,
    isNewMode,
    dialogName,
  };
  const isLoading = isTaxRateLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <TaxRateFormDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useTaxRateFormDialogContext = (): TaxRateFormDialogBootContext => {
  const context = useContext(TaxRateFormDialogContext);
  if (!context) {
    throw new Error(
      'useTaxRateFormDialogContext must be used within a TaxRateFormDialogBoot.',
    );
  }
  return context;
};

export { TaxRateFormDialogBoot, useTaxRateFormDialogContext };
