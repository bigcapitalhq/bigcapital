import React from 'react';
import { useLatestExchangeRate } from '@/hooks/query';

interface AutoExchangeRateProviderProps {
  children: React.ReactNode;
}

interface AutoExchangeRateProviderValue {
  autoExRateCurrency: string | null;
  setAutoExRateCurrency: (currency: string | null) => void;
  isAutoExchangeRateLoading: boolean;
  autoExchangeRate?: { exchangeRate?: number } | null;
}

const AutoExchangeRateContext =
  React.createContext<AutoExchangeRateProviderValue>(
    {} as AutoExchangeRateProviderValue,
  );

function AutoExchangeRateProvider({ children }: AutoExchangeRateProviderProps) {
  const [autoExRateCurrency, setAutoExRateCurrency] = React.useState<
    string | null
  >('');

  // Retrieves the exchange rate.
  const { data: autoExchangeRate, isLoading: isAutoExchangeRateLoading } =
    useLatestExchangeRate(
      { fromCurrency: autoExRateCurrency ?? undefined },
      {
        enabled: Boolean(autoExRateCurrency),
        refetchOnWindowFocus: false,
        staleTime: 0,
        gcTime: 0,
        retry: 0,
      },
    );

  const value = {
    autoExRateCurrency,
    setAutoExRateCurrency,
    isAutoExchangeRateLoading,
    autoExchangeRate,
  } as AutoExchangeRateProviderValue;

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
