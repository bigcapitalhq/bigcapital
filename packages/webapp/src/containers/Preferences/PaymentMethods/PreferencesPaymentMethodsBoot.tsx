import React, { createContext, ReactNode, useContext } from 'react';
import { useGetPaymentServicesState } from '@/hooks/query/payment-services';

type PaymentMethodsContextType = {
  isPaymentMethodsStateLoading: boolean;
  paymentMethodsState: any;
};

const PaymentMethodsContext = createContext<PaymentMethodsContextType>(
  {} as PaymentMethodsContextType,
);

type PaymentMethodsProviderProps = {
  children: ReactNode;
};

const PaymentMethodsBoot = ({ children }: PaymentMethodsProviderProps) => {
  const { data: paymentMethodsState, isLoading: isPaymentMethodsStateLoading } =
    useGetPaymentServicesState();

  const value = { isPaymentMethodsStateLoading, paymentMethodsState };

  return (
    <PaymentMethodsContext.Provider value={value}>
      {children}
    </PaymentMethodsContext.Provider>
  );
};

const usePaymentMethodsBoot = () => {
  const context = useContext<PaymentMethodsContextType>(PaymentMethodsContext);
  if (context === undefined) {
    throw new Error(
      'usePaymentMethods must be used within a PaymentMethodsProvider',
    );
  }
  return context;
};

export { PaymentMethodsBoot, usePaymentMethodsBoot };
