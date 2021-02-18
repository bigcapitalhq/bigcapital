import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useExchangeRates } from 'hooks/query';

const ExchangesRatesContext = createContext();

/**
 * Exchanges rates list provider.
 */
function ExchangeRatesProvider({ query, ...props }) {
  const {
    data: { exchangesRates, pagination },
    isFetching: isExchangeRatesFetching,
    isLoading: isExchangeRatesLoading,
  } = useExchangeRates();

  const state = {
    isExchangeRatesFetching,
    isExchangeRatesLoading,

    exchangesRates,
    pagination,
    query,
  };

  return (
    <DashboardInsider name={'exchange-rate-list'}>
      <ExchangesRatesContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useExchangeRatesContext = () => React.useContext(ExchangesRatesContext);

export { ExchangeRatesProvider, useExchangeRatesContext };
