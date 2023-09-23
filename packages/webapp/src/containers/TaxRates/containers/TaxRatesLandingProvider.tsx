// @ts-nocheck
import React from 'react';
import { isEmpty } from 'lodash';
import { DashboardInsider } from '@/components/Dashboard';
import { useTaxRates } from '@/hooks/query/taxRates';

const TaxRatesLandingContext = React.createContext();

/**
 * Cash Flow data provider.
 */
function TaxRatesLandingProvider({ tableState, ...props }) {
  // Fetch cash flow list .
  const {
    data: taxRates,
    isFetching: isTaxRatesFetching,
    isLoading: isTaxRatesLoading,
  } = useTaxRates({}, { keepPreviousData: true });

  // Detarmines whether the table should show empty state.
  const isEmptyStatus = isEmpty(taxRates) && !isTaxRatesLoading;

  // Provider payload.
  const provider = {
    taxRates,
    isTaxRatesFetching,
    isTaxRatesLoading,
    isEmptyStatus
  };

  return (
    <DashboardInsider name={'tax-rate-form'}>
      <TaxRatesLandingContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useTaxRatesLandingContext = () =>
  React.useContext(TaxRatesLandingContext);

export { TaxRatesLandingProvider, useTaxRatesLandingContext };
