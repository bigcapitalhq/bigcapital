import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import { useAccounts } from '@/hooks/query';
import { useGetPaymentMethod } from '@/hooks/query/payment-services';

interface StripeIntegrationEditContextType {
  accounts: any;
  isAccountsLoading: boolean;

  paymentMethod: any;
  isPaymentMethodLoading: boolean;
}

const StripeIntegrationEditContext =
  createContext<StripeIntegrationEditContextType>(
    {} as StripeIntegrationEditContextType,
  );

export const useStripeIntegrationEditBoot = () => {
  const context = useContext<StripeIntegrationEditContextType>(
    StripeIntegrationEditContext,
  );

  if (!context) {
    throw new Error(
      'useStripeIntegrationEditContext must be used within a StripeIntegrationEditProvider',
    );
  }
  return context;
};

export const StripeIntegrationEditBoot: React.FC = ({ children }) => {
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts({}, {});
  const { data: paymentMethod, isLoading: isPaymentMethodLoading } =
    useGetPaymentMethod(9);

  const value = {
    // Accounts.
    accounts,
    isAccountsLoading,

    // Payment methods.
    paymentMethod,
    isPaymentMethodLoading,
  };
  const isLoading = isAccountsLoading || isPaymentMethodLoading;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  return (
    <StripeIntegrationEditContext.Provider value={value}>
      {children}
    </StripeIntegrationEditContext.Provider>
  );
};
