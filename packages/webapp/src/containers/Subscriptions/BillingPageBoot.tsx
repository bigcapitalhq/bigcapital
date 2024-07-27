import React, { createContext } from 'react';
import { useGetSubscriptions } from '@/hooks/query/subscription';

interface BillingBootContextValues {
  isSubscriptionsLoading: boolean;
  subscriptions: any;
}

const BillingBoot = createContext<BillingBootContextValues>(
  {} as BillingBootContextValues,
);

interface BillingPageBootProps {
  children: React.ReactNode;
}

export function BillingPageBoot({ children }: BillingPageBootProps) {
  const { isLoading: isSubscriptionsLoading, data: subscriptions } =
    useGetSubscriptions();

  const value = {
    isSubscriptionsLoading,
    subscriptions,
  };
  return <BillingBoot.Provider value={value}>{children}</BillingBoot.Provider>;
}

export const useBillingPageBoot = () => React.useContext(BillingBoot);
