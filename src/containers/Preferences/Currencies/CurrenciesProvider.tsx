// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { useCurrencies } from '@/hooks/query';

const CurrenciesContext = createContext();

/**
 * currencies provider.
 */
function CurrenciesProvider({ ...props }) {
  // fetches the currencies list.
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  const state = {
    currencies,
    isCurrenciesLoading,
  };

  return <CurrenciesContext.Provider value={state} {...props} />;
}

const useCurrenciesContext = () => useContext(CurrenciesContext);

export { CurrenciesProvider, useCurrenciesContext };
