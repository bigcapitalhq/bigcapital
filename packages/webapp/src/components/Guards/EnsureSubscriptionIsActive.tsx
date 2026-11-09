import { includes } from 'lodash';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSubscription } from '@/hooks/query';

interface EnsureSubscriptionIsActiveProps {
  children: React.ReactNode;
  subscriptionType?: string;
  redirectTo?: string;
  routePath?: string;
  exclude?: string[];
}

/**
 * Ensures the given subscription type is active or redirects to the given route.
 */
export default function EnsureSubscriptionIsActive({
  children,
  subscriptionType = 'main',
  redirectTo = '/billing',
  routePath,
  exclude,
}: EnsureSubscriptionIsActiveProps) {
  const { isSubscriptionActive } = useSubscription(subscriptionType);

  return isSubscriptionActive || includes(exclude, routePath) ? (
    <>{children}</>
  ) : (
    <Redirect to={{ pathname: redirectTo }} />
  );
}
