import React from 'react';
import { Switch, Route } from 'react-router';
import { useQuery } from 'react-query';

import Dashboard from 'components/Dashboard/Dashboard';
import SetupWizardPage from 'containers/Setup/WizardSetupPage';
import DashboardLoadingIndicator from 'components/Dashboard/DashboardLoadingIndicator';

import withOrganizationActions from 'containers/Organization/withOrganizationActions';
import withSubscriptionsActions from 'containers/Subscriptions/withSubscriptionsActions';

import { compose } from 'utils';

/**
 * Dashboard inner private pages.
 */
function DashboardPrivatePages({

  // #withOrganizationActions
  requestAllOrganizations,

  // #withSubscriptionsActions
  requestFetchSubscriptions,
}) {
  // Fetch all user's organizatins.
  const fetchOrganizations = useQuery(
    ['organizations'], () => requestAllOrganizations(),
  );

  // Fetchs organization subscriptions.
  const fetchSuscriptions = useQuery(
    ['susbcriptions'], () => requestFetchSubscriptions(),
    { enabled: fetchOrganizations.data },
  )

  return (
    <DashboardLoadingIndicator isLoading={
      fetchOrganizations.isFetching ||
      fetchSuscriptions.isFetching
    }>
      <Switch>
        <Route path={'/setup'}>
          <SetupWizardPage />
        </Route>

        <Route path='/'>
          <Dashboard />
        </Route>
      </Switch>
    </DashboardLoadingIndicator>
  );
}

export default compose(
  withOrganizationActions,
  withSubscriptionsActions,
)(DashboardPrivatePages);