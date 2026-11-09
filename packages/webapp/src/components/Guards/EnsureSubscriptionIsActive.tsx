import { Spinner } from '@blueprintjs/core';
import { includes } from 'lodash';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useDashboardMeta } from '@/hooks/query';
import { useSubscription } from '@/hooks/query';

interface EnsureSubscriptionIsActiveProps {
  children: React.ReactNode;
  subscriptionType?: string;
  redirectTo?: string;
  routePath?: string;
  exclude?: string[];
}

/**
 * Ensures the given subscription type is active on Bigcapital Cloud, otherwise
 * redirects to the billing page. Self-hosted installations always pass.
 */
export default function EnsureSubscriptionIsActive({
  children,
  subscriptionType = 'main',
  redirectTo = '/preferences/billing',
  routePath,
  exclude,
}: EnsureSubscriptionIsActiveProps) {
  const { data: dashboardMeta, isLoading: isMetaLoading } = useDashboardMeta();
  const { subscription, isSubscriptionActive, isLoading } =
    useSubscription(subscriptionType);

  if (isMetaLoading || isLoading) {
    return <Spinner size={30} />;
  }

  if (!dashboardMeta?.isBigcapitalCloud) {
    return <>{children}</>;
  }

  // Cloud requires a paid plan linked to a billing provider. The free plan is
  // reserved for self-hosted installations.
  const hasPaidSubscription =
    isSubscriptionActive &&
    (!!subscription?.stripeStatus || Number(subscription?.planPrice || 0) > 0);

  return hasPaidSubscription || includes(exclude, routePath) ? (
    <>{children}</>
  ) : (
    <Redirect to={{ pathname: redirectTo }} />
  );
}
