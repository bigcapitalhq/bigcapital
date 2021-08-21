import React from 'react';
import { Switch, Route } from 'react-router';

import 'style/pages/Dashboard/Dashboard.scss';

import Sidebar from 'components/Sidebar/Sidebar';
import DashboardContent from 'components/Dashboard/DashboardContent';
import DialogsContainer from 'components/DialogsContainer';
import PreferencesPage from 'components/Preferences/PreferencesPage';
import DashboardUniversalSearch from 'containers/UniversalSearch/DashboardUniversalSearch';
import DashboardSplitPane from 'components/Dashboard/DashboardSplitePane';
import GlobalHotkeys from './GlobalHotkeys';
import DashboardProvider from './DashboardProvider';
import DrawersContainer from 'components/DrawersContainer';

/**
 * Dashboard page.
 */
export default function Dashboard() {
  return (
    <DashboardProvider>
      <Switch>
        <Route path="/preferences">
          <DashboardSplitPane>
            <Sidebar />
            <PreferencesPage />
          </DashboardSplitPane>
        </Route>

        <Route path="/">
          <DashboardSplitPane>
            <Sidebar />
            <DashboardContent />
          </DashboardSplitPane>
        </Route>
      </Switch>

      <DashboardUniversalSearch />
      <DialogsContainer />
      <GlobalHotkeys />
      <DrawersContainer />
    </DashboardProvider>
  );
}
