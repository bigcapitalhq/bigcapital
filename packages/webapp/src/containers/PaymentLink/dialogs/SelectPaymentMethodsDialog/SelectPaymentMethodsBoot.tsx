import { useGetPaymentServices } from '@/hooks/query/payment-services';
import React, { createContext, useContext, ReactNode } from 'react';

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
  const { isLoading: isPaymentServicesLoading, data: paymentServices } =
    useGetPaymentServices();

  const value = {
    paymentServices,
    isPaymentServicesLoading,
  };

  return (
    <SelectPaymentMethodsContext.Provider value={value}>
      {children}
    </SelectPaymentMethodsContext.Provider>
  );
};
