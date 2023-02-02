// @ts-nocheck
import React, { createContext } from 'react';
import { transformTableQueryToParams } from '@/utils';

import { DashboardInsider } from '@/components';
import { useExchangeRates } from '@/hooks/query';

const ExchangesRatesContext = createContext();

/**
 * Exchanges rates list provider.
 */
function ExchangeRatesProvider({ query, ...props }) {
  const {
    data: { exchangesRates, pagination, filterMeta },
    isFetching: isExchangeRatesFetching,
    isLoading: isExchangeRatesLoading,
  } = useExchangeRates(
    {
      ...transformTableQueryToParams(query),
    },
    { keepPreviousData: true },
  );

  const state = {
    isExchangeRatesFetching,
    isExchangeRatesLoading,

    exchangesRates,
    pagination,
  };

  return (
    <DashboardInsider name={'exchange-rate'}>
      <ExchangesRatesContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useExchangeRatesContext = () => React.useContext(ExchangesRatesContext);

export { ExchangeRatesProvider, useExchangeRatesContext };
