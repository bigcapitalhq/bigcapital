import { useExchangeRate } from '@/hooks/query';
import { useCurrentOrganization } from '@/hooks/state';
import React from 'react';

interface AutoExchangeRateProviderProps {
  children: React.ReactNode;
}

interface AutoExchangeRateProviderValue {
  autoExRateCurrency: string;
  isAutoExchangeRateLoading: boolean;
}

const AutoExchangeRateContext = React.createContext(
  {} as AutoExchangeRateProviderValue,
);

function AutoExchangeRateProvider({ children }: AutoExchangeRateProviderProps) {
  const [autoExRateCurrency, setAutoExRateCurrency] =
    React.useState<string>('');
  const currentOrganization = useCurrentOrganization();

  // Retrieves the exchange rate.
  const { data: autoExchangeRate, isLoading: isAutoExchangeRateLoading } =
    useExchangeRate(autoExRateCurrency, currentOrganization.base_currency, {
      enabled: Boolean(currentOrganization.base_currency && autoExRateCurrency),
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    });

  const value = {
    autoExRateCurrency,
    setAutoExRateCurrency,
    isAutoExchangeRateLoading,
    autoExchangeRate,
  };

  return (
    <AutoExchangeRateContext.Provider value={value}>
      {children}
    </AutoExchangeRateContext.Provider>
  );
}

const useAutoExRateContext = () => React.useContext(AutoExchangeRateContext);

export {
  useAutoExRateContext,
  AutoExchangeRateContext,
  AutoExchangeRateProvider,
};
