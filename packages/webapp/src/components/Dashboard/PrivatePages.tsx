// @ts-nocheck
import React from 'react';
import { Switch,  } from 'react-router';
import { CompatRoute } from 'react-router-dom-v5-compat';

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
        <CompatRoute path={'/setup'}>
          <EnsureOrganizationIsNotReady>
            <SetupWizardPage />
          </EnsureOrganizationIsNotReady>
        </CompatRoute>

        <CompatRoute path="/">
          <EnsureOrganizationIsReady>
            <Dashboard />
          </EnsureOrganizationIsReady>
        </CompatRoute>
      </Switch>
    </PrivatePagesProvider>
  );
}
