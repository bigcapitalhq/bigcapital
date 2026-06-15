// @ts-nocheck
import React from 'react';
import { includes } from 'lodash';

import { Redirect } from 'react-router-dom';
import { withSubscriptions } from '@/containers/Subscriptions/withSubscriptionss';
import { flow } from 'fp-ts/function';

/**
 * Ensures the given subscription type is active or redirect to the given route.
 */
function EnsureSubscriptionsIsInactive({
  children,
  subscriptionType = 'main',
  redirectTo = '/billing',
  routePath,
  exclude,
  isSubscriptionsInactive,
}) {
  return !isSubscriptionsInactive || includes(exclude, routePath) ? (
    children
  ) : (
    <Redirect to={{ pathname: redirectTo }} />
  );
}

export default flow(
  withSubscriptions(
    ({ isSubscriptionsInactive }) => ({ isSubscriptionsInactive }),
    'main',
  ),
)(EnsureSubscriptionsIsInactive);
