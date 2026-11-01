import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { EnsureAuthenticated } from '../Guards/EnsureAuthenticated';
import EnsureOrganizationIsReady from '../Guards/EnsureOrganizationIsReady';
import { EnsureUserEmailVerified } from '../Guards/EnsureUserEmailVerified';
import { PrivatePagesProvider } from './PrivatePagesProvider';
import Dashboard from '@/components/Dashboard/Dashboard';

import '@/style/pages/Dashboard/Dashboard.scss';

const SetupWizardPage = lazy(() =>
  import('@/containers/Setup/WizardSetupPage').then((m) => ({
    default: m.WizardSetupPage,
  })),
);
/**
 * Dashboard inner private pages.
 */
export default function DashboardPrivatePages() {
  return (
    <EnsureAuthenticated>
      <EnsureUserEmailVerified>
        <PrivatePagesProvider>
          <Switch>
            <Route path={'/setup'} children={<SetupWizardPage />} />
            <Route path="/">
              <EnsureOrganizationIsReady>
                <Dashboard />
              </EnsureOrganizationIsReady>
            </Route>
          </Switch>
        </PrivatePagesProvider>
      </EnsureUserEmailVerified>
    </EnsureAuthenticated>
  );
}
