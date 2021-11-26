import React from 'react';
import * as R from 'ramda';

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
    <React.Fragment>
      <DashboardBoot />
      {splashScreenCompleted ? children : null}
    </React.Fragment>
  );
}

export const PrivatePagesProvider = R.compose(
  withDashboard(({ splashScreenCompleted }) => ({
    splashScreenCompleted,
  })),
)(PrivatePagesProviderComponent);
