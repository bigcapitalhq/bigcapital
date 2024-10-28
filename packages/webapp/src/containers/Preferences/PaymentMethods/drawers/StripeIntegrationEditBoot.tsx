import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import { useAccounts } from '@/hooks/query';
import { useGetPaymentMethod } from '@/hooks/query/payment-services';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

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

interface StripeIntegrationEditBootProps {
  children: React.ReactNode;
}

export const StripeIntegrationEditBoot: React.FC<
  StripeIntegrationEditBootProps
> = ({ children }) => {
  const {
    payload: { stripePaymentMethodId },
  } = useDrawerContext();

  const { data: accounts, isLoading: isAccountsLoading } = useAccounts({}, {});
  const { data: paymentMethod, isLoading: isPaymentMethodLoading } =
    useGetPaymentMethod(stripePaymentMethodId, {
      enabled: !!stripePaymentMethodId,
    });

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
