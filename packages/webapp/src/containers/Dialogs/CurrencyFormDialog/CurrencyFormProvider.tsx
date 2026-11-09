import React, { createContext } from 'react';
import type { CurrencyFormContextValue } from './types';
import type { Currency } from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { useCreateCurrency, useEditCurrency } from '@/hooks/query';

const CurrencyFormContext = createContext<CurrencyFormContextValue>(
  {} as CurrencyFormContextValue,
);

interface CurrencyFormProviderProps {
  isEditMode: boolean;
  currency?: Currency;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Currency Form page provider.
 */
function CurrencyFormProvider({
  isEditMode,
  currency,
  dialogName,
  ...props
}: CurrencyFormProviderProps) {
  // Create and edit item currency mutations.
  const { mutateAsync: createCurrencyMutate } = useCreateCurrency();
  const { mutateAsync: editCurrencyMutate } = useEditCurrency();

  // Provider state.
  const provider: CurrencyFormContextValue = {
    createCurrencyMutate,
    editCurrencyMutate,
    dialogName,
    currency,
    isEditMode,
  };

  return (
    <DialogContent name={'currency-form'}>
      <CurrencyFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useCurrencyFormContext = () => React.useContext(CurrencyFormContext);

export { CurrencyFormProvider, useCurrencyFormContext };
