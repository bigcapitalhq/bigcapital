import React from 'react';
import { useLatestExchangeRate } from '@/hooks/query';

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

  // Retrieves the exchange rate.
  const { data: autoExchangeRate, isLoading: isAutoExchangeRateLoading } =
    useLatestExchangeRate(
      { fromCurrency: autoExRateCurrency },
      {
        enabled: Boolean(autoExRateCurrency),
        refetchOnWindowFocus: false,
        staleTime: 0,
        cacheTime: 0,
        retry: 0,
      },
    );

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
