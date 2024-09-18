import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectPaymentMethodsContextType {}

const SelectPaymentMethodsContext =
  createContext<SelectPaymentMethodsContextType>(
    {} as SelectPaymentMethodsContextType,
  );

export const useSelectPaymentMethods = () => {
  const context = useContext(SelectPaymentMethodsContext);

  if (!context) {
    throw new Error(
      'useSelectPaymentMethods must be used within a SelectPaymentMethodsProvider',
    );
  }
  return context;
};

interface SelectPaymentMethodsProviderProps {
  children: ReactNode;
}

export const SelectPaymentMethodsBoot: React.FC<
  SelectPaymentMethodsProviderProps
> = ({ children }) => {
  return (
    <SelectPaymentMethodsContext.Provider
      value={{ }}
    >
      {children}
    </SelectPaymentMethodsContext.Provider>
  );
};
