import { keepPreviousData } from '@tanstack/react-query';
import { createContext, ReactNode, useContext } from 'react';
import type { TaxRate } from '@bigcapital/sdk-ts';
import { DrawerLoading } from '@/components';
import { useTaxRate } from '@/hooks/query/tax-rates';

export interface TaxRateDetailsContextValue {
  isTaxRateLoading: boolean;
  isTaxRateFetching: boolean;
  taxRate: TaxRate | undefined;
  taxRateId: number;
}

export interface TaxRateDetailsContentBootProps {
  taxRateId: number;
  children?: ReactNode;
}

const TaxRateDetailsContext = createContext<
  TaxRateDetailsContextValue | undefined
>(undefined);

/**
 * Tax rate details content boot.
 * @returns {JSX}
 */
export function TaxRateDetailsContentBoot({
  taxRateId,
  ...props
}: TaxRateDetailsContentBootProps) {
  const {
    data: taxRate,
    isFetching: isTaxRateFetching,
    isLoading: isTaxRateLoading,
  } = useTaxRate(taxRateId, { placeholderData: keepPreviousData });

  const provider: TaxRateDetailsContextValue = {
    isTaxRateLoading,
    isTaxRateFetching,
    taxRate,
    taxRateId,
  };

  return (
    <DrawerLoading loading={isTaxRateLoading}>
      <TaxRateDetailsContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

export const useTaxRateDetailsContext = (): TaxRateDetailsContextValue => {
  const context = useContext(TaxRateDetailsContext);
  if (!context) {
    throw new Error(
      'useTaxRateDetailsContext must be used within a TaxRateDetailsContentBoot.',
    );
  }
  return context;
};
