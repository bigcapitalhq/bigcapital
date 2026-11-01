import { includes } from 'lodash';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useGetSubscriptions } from '@/hooks/query';

interface EnsureSubscriptionsIsInactiveProps {
  children: React.ReactNode;
  redirectTo?: string;
  routePath?: string;
  exclude?: string[];
}

/**
 * Renders children when no subscription is inactive; redirects otherwise.
 */
export default function EnsureSubscriptionsIsInactive({
  children,
  redirectTo = '/billing',
  routePath,
  exclude,
}: EnsureSubscriptionsIsInactiveProps) {
  const { data } = useGetSubscriptions();
  const isSubscriptionsInactive = !!data?.subscriptions?.some(
    (s) => s.inactive,
  );

  return !isSubscriptionsInactive || includes(exclude, routePath) ? (
    <>{children}</>
  ) : (
    <Redirect to={{ pathname: redirectTo }} />
  );
}
