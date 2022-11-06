// @ts-nocheck
import React, { createContext, useContext } from 'react';
import {
  useCreateExchangeRate,
  useEdiExchangeRate,
  useCurrencies,
  useExchangeRates,
} from '@/hooks/query';
import { DialogContent } from '@/components';

const ExchangeRateFormContext = createContext();

/**
 * Exchange rate Form page provider.
 */
function ExchangeRateFormProvider({
  exchangeRate,
  action,
  dialogName,
  ...props
}) {
  // Create and edit  exchange rate mutations.
  const { mutateAsync: createExchangeRateMutate } = useCreateExchangeRate();
  const { mutateAsync: editExchangeRateMutate } = useEdiExchangeRate();

  // Load Currencies list.
  const { data: currencies, isFetching: isCurrenciesLoading } = useCurrencies();
  const { isFetching: isExchangeRatesLoading } = useExchangeRates();

  const isNewMode = !exchangeRate;

  // Provider state.
  const provider = {
    createExchangeRateMutate,
    editExchangeRateMutate,
    dialogName,
    exchangeRate,
    action,
    currencies,
    isExchangeRatesLoading,
    isNewMode,
  };

  return (
    <DialogContent isLoading={isCurrenciesLoading} name={'exchange-rate-form'}>
      <ExchangeRateFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useExchangeRateFromContext = () => useContext(ExchangeRateFormContext);

export { ExchangeRateFormProvider, useExchangeRateFromContext };
