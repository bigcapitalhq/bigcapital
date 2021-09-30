import React from 'react';
import * as R from 'ramda';

import { AuthenticatedUser } from './AuthenticatedUser';
import { DashboardBoot } from '../../components';

import withDashboard from '../../containers/Dashboard/withDashboard';

/**
 * Private pages provider.
 */
function PrivatePagesProviderComponent({
  splashScreenCompleted,

  // #ownProps
  children,
}) {
  return (
    <AuthenticatedUser>
      <DashboardBoot />

      {splashScreenCompleted ? children : null}
    </AuthenticatedUser>
  );
}

export const PrivatePagesProvider = R.compose(
  withDashboard(({ splashScreenCompleted }) => ({
    splashScreenCompleted,
  })),
)(PrivatePagesProviderComponent);
