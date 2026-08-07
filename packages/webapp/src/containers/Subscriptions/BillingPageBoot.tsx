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
  const { isLoading: isSubscriptionsLoading, data: subscriptionsRes } =
    useGetSubscriptions();

  const mainSubscription = subscriptionsRes?.subscriptions?.find(
    (s) => s.slug === 'main',
  );

  const value = {
    isSubscriptionsLoading,
    subscriptions: subscriptionsRes?.subscriptions,
    mainSubscription,
  };
  return <BillingBoot.Provider value={value}>{children}</BillingBoot.Provider>;
}

export const useBillingPageBoot = () => React.useContext(BillingBoot);
