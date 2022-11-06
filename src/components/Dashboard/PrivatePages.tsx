// @ts-nocheck
import React from 'react';
import { Switch, Route } from 'react-router';

import Dashboard from '@/components/Dashboard/Dashboard';
import SetupWizardPage from '@/containers/Setup/WizardSetupPage';

import EnsureOrganizationIsReady from '../Guards/EnsureOrganizationIsReady';
import EnsureOrganizationIsNotReady from '../Guards/EnsureOrganizationIsNotReady';
import { PrivatePagesProvider } from './PrivatePagesProvider';

import '@/style/pages/Dashboard/Dashboard.scss';

/**
 * Dashboard inner private pages.
 */
export default function DashboardPrivatePages() {
  return (
    <PrivatePagesProvider>
      <Switch>
        <Route path={'/setup'}>
          <EnsureOrganizationIsNotReady>
            <SetupWizardPage />
          </EnsureOrganizationIsNotReady>
        </Route>

        <Route path="/">
          <EnsureOrganizationIsReady>
            <Dashboard />
          </EnsureOrganizationIsReady>
        </Route>
      </Switch>
    </PrivatePagesProvider>
  );
}
