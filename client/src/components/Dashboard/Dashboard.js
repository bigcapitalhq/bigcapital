import React from 'react';
import { Switch, Route } from 'react-router';

import 'style/pages/Dashboard/Dashboard.scss';

import Sidebar from 'components/Sidebar/Sidebar';
import DashboardContent from 'components/Dashboard/DashboardContent';
import DialogsContainer from 'components/DialogsContainer';
import PreferencesPage from 'components/Preferences/PreferencesPage';
import Search from 'containers/GeneralSearch/Search';
import DashboardSplitPane from 'components/Dashboard/DashboardSplitePane';
import GlobalHotkeys from './GlobalHotkeys';
import DashboardProvider from './DashboardProvider';
import DrawersContainer from 'components/DrawersContainer';

/**
 * Dashboard page.
 */
export default function Dashboard() {
  const dashboardContentRef = React.createRef();

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
            <Sidebar dashboardContentRef={dashboardContentRef} />
            <DashboardContent ref={dashboardContentRef} />
          </DashboardSplitPane>
        </Route>
      </Switch>

      <Search />
      <DialogsContainer />
      <GlobalHotkeys />
      <DrawersContainer />
    </DashboardProvider>
  );
}
