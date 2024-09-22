import { createContext, ReactNode, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import {
  GetPaymentServicesStateResponse,
  useGetPaymentServicesState,
} from '@/hooks/query/payment-services';

type PaymentMethodsContextType = {
  isPaymentMethodsStateLoading: boolean;
  paymentMethodsState: GetPaymentServicesStateResponse | undefined;
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

  if (isPaymentMethodsStateLoading) {
    return <Spinner size={20} />;
  }
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
