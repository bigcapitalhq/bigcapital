import React, { createContext, useContext } from 'react';
import type { CurrenciesListResponse } from '@bigcapital/sdk-ts';
import { useCurrencies } from '@/hooks/query';

export interface CurrenciesContextValue {
  currencies: CurrenciesListResponse | undefined;
  isCurrenciesLoading: boolean;
}

const CurrenciesContext = createContext<CurrenciesContextValue>(
  {} as CurrenciesContextValue,
);

export interface CurrenciesProviderProps {
  children?: React.ReactNode;
}

/**
 * currencies provider.
 */
function CurrenciesProvider({ children }: CurrenciesProviderProps) {
  // fetches the currencies list.
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  const state: CurrenciesContextValue = {
    currencies,
    isCurrenciesLoading,
  };

  return (
    <CurrenciesContext.Provider value={state}>
      {children}
    </CurrenciesContext.Provider>
  );
}

const useCurrenciesContext = () => useContext(CurrenciesContext);

export { CurrenciesProvider, useCurrenciesContext };
