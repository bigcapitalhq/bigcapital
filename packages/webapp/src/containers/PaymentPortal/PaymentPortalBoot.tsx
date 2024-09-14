import React, { createContext, useContext, ReactNode } from 'react';

interface PaymentPortalContextType {
  // Define the context type here
  paymentAmount: number;
  setPaymentAmount: (amount: number) => void;
}

const PaymentPortalContext = createContext<PaymentPortalContextType>(
  {} as PaymentPortalContextType,
);

export const PaymentPortalBoot: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [paymentAmount, setPaymentAmount] = React.useState<number>(0);

  return (
    <PaymentPortalContext.Provider value={{ paymentAmount, setPaymentAmount }}>
      {children}
    </PaymentPortalContext.Provider>
  );
};

export const usePaymentPortalBoot = (): PaymentPortalContextType => {
  const context = useContext(PaymentPortalContext);

  if (!context) {
    throw new Error(
      'usePaymentPortal must be used within a PaymentPortalProvider',
    );
  }
  return context;
};
