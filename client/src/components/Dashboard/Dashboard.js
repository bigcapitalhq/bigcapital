import React from 'react';
import { Switch, Route } from 'react-router';
import classNames from 'classnames';

import Sidebar from 'components/Sidebar/Sidebar';
import DashboardContent from 'components/Dashboard/DashboardContent';
import DialogsContainer from 'components/DialogsContainer';
import PreferencesContent from 'components/Preferences/PreferencesContent';
import PreferencesSidebar from 'components/Preferences/PreferencesSidebar';
import Search from 'containers/GeneralSearch/Search';

export default function Dashboard() {
  return (
    <div className={classNames('dashboard')}>
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
