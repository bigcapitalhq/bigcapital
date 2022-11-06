// @ts-nocheck
import React from 'react';
import { includes } from 'lodash';

import { compose } from '@/utils';
import { Redirect } from 'react-router-dom';
import withSubscriptions from '@/containers/Subscriptions/withSubscriptions';

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

export default compose(
  withSubscriptions(
    ({ isSubscriptionActive }) => ({ isSubscriptionActive }),
    'main',
  ),
)(EnsureSubscriptionIsActive);
