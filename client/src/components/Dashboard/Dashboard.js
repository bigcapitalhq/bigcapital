import React from 'react';
import { Switch, Route } from 'react-router';
import { useQuery } from 'react-query';

import 'style/pages/Dashboard/Dashboard.scss';

import DashboardLoadingIndicator from './DashboardLoadingIndicator';

import Sidebar from 'components/Sidebar/Sidebar';
import DashboardContent from 'components/Dashboard/DashboardContent';
import DialogsContainer from 'components/DialogsContainer';
import PreferencesPage from 'components/Preferences/PreferencesPage';
import Search from 'containers/GeneralSearch/Search';
import DashboardSplitPane from 'components/Dashboard/DashboardSplitePane';
import GlobalHotkeys from './GlobalHotkeys';
import withSettingsActions from 'containers/Settings/withSettingsActions';

import { compose } from 'utils';

/**
 * Dashboard page.
 */
function Dashboard({
  // #withSettings
  requestFetchOptions,
}) {
  const fetchOptions = useQuery(['options'], () => requestFetchOptions());

  return (
    <DashboardLoadingIndicator isLoading={fetchOptions.isFetching}>
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

      <Search />
      <DialogsContainer />
      <GlobalHotkeys />
    </DashboardLoadingIndicator>
  );
}

export default compose(withSettingsActions)(Dashboard);
