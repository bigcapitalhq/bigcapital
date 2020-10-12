import React from 'react';
import { Switch, Route } from 'react-router';
import { useQuery } from 'react-query';

import DashboardLoadingIndicator from './DashboardLoadingIndicator';

import Sidebar from 'components/Sidebar/Sidebar';
import DashboardContent from 'components/Dashboard/DashboardContent';
import DialogsContainer from 'components/DialogsContainer';
import PreferencesContent from 'components/Preferences/PreferencesContent';
import PreferencesSidebar from 'components/Preferences/PreferencesSidebar';
import Search from 'containers/GeneralSearch/Search';
import DashboardSplitPane from 'components/Dashboard/DashboardSplitePane';
import EnsureOrganizationIsReady from './EnsureOrganizationIsReady';

import withSettingsActions from 'containers/Settings/withSettingsActions';

import { compose } from 'utils';


function Dashboard({
  // #withSettings
  requestFetchOptions,
}) {
  // const fetchOptions = useQuery(
  //   ['options'], () => requestFetchOptions(),
  // );

  return (
    <EnsureOrganizationIsReady>
      <DashboardLoadingIndicator isLoading={false}>
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
      </DashboardLoadingIndicator>
    </EnsureOrganizationIsReady>
  );
}

export default compose(
  withSettingsActions,
)(Dashboard);