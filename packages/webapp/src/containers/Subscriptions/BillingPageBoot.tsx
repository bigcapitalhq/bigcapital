import React, { createContext } from 'react';
import type {
  BillingOverviewResponse,
  SubscriptionPlansResponse,
  SubscriptionsListResponse,
} from '@bigcapital/sdk-ts';
import {
  useGetBillingOverview,
  useGetSubscriptionPlans,
  useGetSubscriptions,
} from '@/hooks/query/subscription';

type Subscription = SubscriptionsListResponse['subscriptions'][number];
type PlanGroup = SubscriptionPlansResponse['plans'][number];

interface BillingBootContextValues {
  isSubscriptionsLoading: boolean;
  isPlansLoading: boolean;
  isBillingOverviewLoading: boolean;
  isLoading: boolean;
  subscriptions?: Subscription[];
  plans: PlanGroup[];
  billingOverview?: BillingOverviewResponse;
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
  const billingOverviewQuery = useGetBillingOverview();

  const subscriptions = subscriptionsQuery.data?.subscriptions;
  const mainSubscription = subscriptions?.find((s) => s.slug === 'main');

  const isSubscriptionsLoading = subscriptionsQuery.isLoading;
  const isPlansLoading = plansQuery.isLoading;
  const isBillingOverviewLoading = billingOverviewQuery.isLoading;
  const isLoading =
    isSubscriptionsLoading || isPlansLoading || isBillingOverviewLoading;

  const value = {
    isSubscriptionsLoading,
    isPlansLoading,
    isBillingOverviewLoading,
    isLoading,
    subscriptions,
    plans: plansQuery.data?.plans || [],
    billingOverview: billingOverviewQuery.data,
    mainSubscription,
  };
  return <BillingBoot.Provider value={value}>{children}</BillingBoot.Provider>;
}

export const useBillingPageBoot = () => React.useContext(BillingBoot);
