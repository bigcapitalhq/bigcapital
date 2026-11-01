import { includes } from 'lodash';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useGetSubscriptions } from '@/hooks/query';

interface EnsureSubscriptionsIsActiveProps {
  children: React.ReactNode;
  redirectTo?: string;
  routePath?: string;
  exclude?: string[];
}

/**
 * Renders children when no subscription is active; redirects otherwise.
 */
export default function EnsureSubscriptionsIsActive({
  children,
  redirectTo = '/billing',
  routePath,
  exclude,
}: EnsureSubscriptionsIsActiveProps) {
  const { data } = useGetSubscriptions();
  const isSubscriptionsActive = !!data?.subscriptions?.some((s) => s.active);

  return !isSubscriptionsActive || includes(exclude, routePath) ? (
    <>{children}</>
  ) : (
    <Redirect to={{ pathname: redirectTo }} />
  );
}
