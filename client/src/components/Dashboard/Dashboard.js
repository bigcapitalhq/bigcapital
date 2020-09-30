import React from 'react';
import { Switch, Route } from 'react-router';
import classNames from 'classnames';

import Sidebar from 'components/Sidebar/Sidebar';
import DashboardContent from 'components/Dashboard/DashboardContent';
import DialogsContainer from 'components/DialogsContainer';
import PreferencesContent from 'components/Preferences/PreferencesContent';
import PreferencesSidebar from 'components/Preferences/PreferencesSidebar';
import Search from 'containers/GeneralSearch/Search';
import DashboardSplitPane from 'components/Dashboard/DashboardSplitePane';

export default function Dashboard() {
  return (
    <div className={classNames('dashboard')}>
      <Switch>
        <Route path="/preferences">
          <DashboardSplitPane>
            <Sidebar />
            <PreferencesSidebar />
          </DashboardSplitPane>
          <PreferencesContent />
        </Route>

        <Route path="/">
          <DashboardSplitPane>
            <Sidebar />
            <DashboardContent />
          </DashboardSplitPane>
        </Route>
      </Switch>

      <Search />
      <DialogsContainer />
    </div>
  );
}
