import React from 'react';
import { Switch, Route } from 'react-router';
import classNames from 'classnames';

import Sidebar from 'components/Sidebar/Sidebar';
import DashboardContent from 'components/Dashboard/DashboardContent';
import DialogsContainer from 'components/DialogsContainer';
import PreferencesContent from 'components/Preferences/PreferencesContent';
import PreferencesSidebar from 'components/Preferences/PreferencesSidebar';
import Search from 'containers/GeneralSearch/Search';
import withDashboard from 'containers/Dashboard/withDashboard';

import { compose } from 'utils';

function Dashboard({ sidebarExpended }) {
  return (
    <div className={classNames('dashboard', {
      'has-mini-sidebar': !sidebarExpended,
    })}>
      <Switch>
        <Route path="/preferences">
          <Sidebar />
          <PreferencesSidebar />
          <PreferencesContent />
        </Route>

        <Route path="/">
          <Sidebar />
          <DashboardContent />
        </Route>
      </Switch>

      <Search />
      <DialogsContainer />
    </div>
  );
}

export default compose(
  withDashboard(({ sidebarExpended }) => ({
    sidebarExpended,
  })),
)(Dashboard);
