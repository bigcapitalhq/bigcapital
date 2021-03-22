import React, { createContext } from 'react';
import { useCurrencies, useEditCurrency, useCreateCurrency } from 'hooks/query';
import { DialogContent } from 'components';

const CurrencyFormContext = createContext();

/**
 * Currency Form page provider.
 */

function CurrencyFormProvider({ isEditMode, currency, dialogName, ...props }) {
  // Create and edit item currency mutations.
  const { mutateAsync: createCurrencyMutate } = useCreateCurrency();
  const { mutateAsync: editCurrencyMutate } = useEditCurrency();

  // fetch Currencies list.
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  // Provider state.
  const provider = {
    createCurrencyMutate,
    editCurrencyMutate,
    dialogName,
    currency,
    isCurrenciesLoading,
    isEditMode,
  };

  return (
    <DialogContent isLoading={isCurrenciesLoading} name={'currency-form'}>
      <CurrencyFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useCurrencyFormContext = () => React.useContext(CurrencyFormContext);

export { CurrencyFormProvider, useCurrencyFormContext };
