// @ts-nocheck
import React from 'react';
import { includes } from 'lodash';

import { Redirect } from 'react-router-dom';
import { withSubscriptions } from '@/containers/Subscriptions/withSubscriptions';
import { flow } from 'fp-ts/function';

/**
 * Ensures the given subscription type is active or redirect to the given route.
 */
function EnsureSubscriptionIsActive({
  children,
  subscriptionType = 'main',
  redirectTo = '/billing',
  routePath,
  exclude,
  isSubscriptionActive,
}) {
  return isSubscriptionActive || includes(exclude, routePath) ? (
    children
  ) : (
    <Redirect to={{ pathname: redirectTo }} />
  );
}

export default flow(
  withSubscriptions(
    ({ isSubscriptionActive }) => ({ isSubscriptionActive }),
    'main',
  ),
)(EnsureSubscriptionIsActive);
