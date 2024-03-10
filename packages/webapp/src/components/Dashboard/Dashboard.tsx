// @ts-nocheck
import React from 'react';
import { Switch, Route } from 'react-router';

import '@/style/pages/Dashboard/Dashboard.scss';

import { Sidebar } from '@/containers/Dashboard/Sidebar/Sidebar';
import DashboardContent from '@/components/Dashboard/DashboardContent';
import DialogsContainer from '@/components/DialogsContainer';
import PreferencesPage from '@/components/Preferences/PreferencesPage';
import DashboardUniversalSearch from '@/containers/UniversalSearch/DashboardUniversalSearch';
import DashboardSplitPane from '@/components/Dashboard/DashboardSplitePane';
import GlobalHotkeys from './GlobalHotkeys';
import DashboardProvider from './DashboardProvider';
import DrawersContainer from '@/components/DrawersContainer';
import AlertsContainer from '@/containers/AlertsContainer';
import { DashboardSockets } from './DashboardSockets';

/**
 * Dashboard preferences.
 */
function DashboardPreferences() {
  return (
    <DashboardSplitPane>
      <Sidebar />
      <PreferencesPage />
    </DashboardSplitPane>
  );
}

/**
 * Dashboard other routes.
 */
function DashboardAnyPage() {
  return (
    <DashboardSplitPane>
      <Sidebar />
      <DashboardContent />
    </DashboardSplitPane>
  );
}

/**
 * Dashboard page.
 */
export default function Dashboard() {
  return (
    <DashboardProvider>
      <Switch>
        <Route path="/preferences" component={DashboardPreferences} />
        <Route path="/" component={DashboardAnyPage} />
      </Switch>

      <DashboardSockets />
      <DashboardUniversalSearch />
      <GlobalHotkeys />
      <DialogsContainer />
      <DrawersContainer />
      <AlertsContainer />
    </DashboardProvider>
  );
}
