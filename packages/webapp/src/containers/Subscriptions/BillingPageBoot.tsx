import React, { createContext } from 'react';
import type {
  SubscriptionPlansResponse,
  SubscriptionsListResponse,
} from '@bigcapital/sdk-ts';
import {
  useGetSubscriptionPlans,
  useGetSubscriptions,
} from '@/hooks/query/subscription';

type Subscription = SubscriptionsListResponse['subscriptions'][number];
type PlanGroup = SubscriptionPlansResponse['plans'][number];

interface BillingBootContextValues {
  isSubscriptionsLoading: boolean;
  isPlansLoading: boolean;
  isLoading: boolean;
  subscriptions?: Subscription[];
  plans: PlanGroup[];
  mainSubscription?: Subscription;
}

const BillingBoot = createContext<BillingBootContextValues>(
  {} as BillingBootContextValues,
);

interface BillingPageBootProps {
  children: React.ReactNode;
}

export function BillingPageBoot({ children }: BillingPageBootProps) {
  const subscriptionsQuery = useGetSubscriptions();
  const plansQuery = useGetSubscriptionPlans();

  const subscriptions = subscriptionsQuery.data?.subscriptions;
  const mainSubscription = subscriptions?.find((s) => s.slug === 'main');

  const isSubscriptionsLoading = subscriptionsQuery.isLoading;
  const isPlansLoading = plansQuery.isLoading;
  const isLoading = isSubscriptionsLoading || isPlansLoading;

  const value = {
    isSubscriptionsLoading,
    isPlansLoading,
    isLoading,
    subscriptions,
    plans: plansQuery.data?.plans || [],
    mainSubscription,
  };
  return <BillingBoot.Provider value={value}>{children}</BillingBoot.Provider>;
}

export const useBillingPageBoot = () => React.useContext(BillingBoot);
