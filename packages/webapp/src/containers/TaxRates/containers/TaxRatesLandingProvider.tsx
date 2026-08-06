import { keepPreviousData } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { createContext, ReactNode, useContext } from 'react';
import type { TaxRate } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import { useTaxRates } from '@/hooks/query/tax-rates';

export interface TaxRatesLandingContextValue {
  taxRates: TaxRate[] | undefined;
  isTaxRatesFetching: boolean;
  isTaxRatesLoading: boolean;
  isEmptyStatus: boolean;
}

export interface TaxRatesLandingProviderProps {
  tableState?: unknown;
  children?: ReactNode;
}

const TaxRatesLandingContext = createContext<
  TaxRatesLandingContextValue | undefined
>(undefined);

/**
 * Cash Flow data provider.
 */
function TaxRatesLandingProvider({
  tableState,
  ...props
}: TaxRatesLandingProviderProps) {
  // Fetch cash flow list .
  const {
    data: taxRates,
    isFetching: isTaxRatesFetching,
    isLoading: isTaxRatesLoading,
  } = useTaxRates({ placeholderData: keepPreviousData });

  // Detarmines whether the table should show empty state.
  const isEmptyStatus = isEmpty(taxRates) && !isTaxRatesLoading;

  // Provider payload.
  const provider: TaxRatesLandingContextValue = {
    taxRates,
    isTaxRatesFetching,
    isTaxRatesLoading,
    isEmptyStatus,
  };

  return (
    <DashboardInsider name={'tax-rate-form'}>
      <TaxRatesLandingContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useTaxRatesLandingContext = (): TaxRatesLandingContextValue => {
  const context = useContext(TaxRatesLandingContext);
  if (!context) {
    throw new Error(
      'useTaxRatesLandingContext must be used within a TaxRatesLandingProvider.',
    );
  }
  return context;
};

export { TaxRatesLandingProvider, useTaxRatesLandingContext };
