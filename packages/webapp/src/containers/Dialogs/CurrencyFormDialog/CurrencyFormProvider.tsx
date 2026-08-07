import React, { createContext } from 'react';
import type { CurrencyFormContextValue } from './types';
import { DialogContent } from '@/components';
import { useCreateCurrency, useEditCurrency } from '@/hooks/query';

const CurrencyFormContext = createContext<CurrencyFormContextValue>(
  {} as CurrencyFormContextValue,
);

interface CurrencyFormProviderProps {
  // FIXME: `isEditMode` receives `action` (string) from `CurrencyFormDialogContent`,
  // not a boolean — kept as a union to reflect runtime while flagging the mismatch.
  isEditMode: boolean | string;
  currency: string | undefined;
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
