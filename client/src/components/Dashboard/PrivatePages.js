import React from 'react';
import { Switch, Route } from 'react-router';
import { useQuery } from 'react-query';

import Dashboard from 'components/Dashboard/Dashboard';
import SetupWizardPage from 'containers/Setup/WizardSetupPage';
import DashboardLoadingIndicator from 'components/Dashboard/DashboardLoadingIndicator';

import withOrganizationActions from 'containers/Organization/withOrganizationActions';
import withSubscriptionsActions from 'containers/Subscriptions/withSubscriptionsActions';

import EnsureOrganizationIsReady from 'components/Guards/EnsureOrganizationIsReady';
import EnsureOrganizationIsNotReady from 'components/Guards/EnsureOrganizationIsNotReady';

import { compose } from 'utils';

import 'style/pages/Dashboard/Dashboard.scss';

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
          <EnsureOrganizationIsNotReady>
            <SetupWizardPage />
          </EnsureOrganizationIsNotReady>
        </Route>

        <Route path='/'>
          <EnsureOrganizationIsReady>
            <Dashboard />
          </EnsureOrganizationIsReady>
        </Route>
      </Switch>
    </DashboardLoadingIndicator>
  );
}

export default compose(
  withOrganizationActions,
  withSubscriptionsActions,
)(DashboardPrivatePages);