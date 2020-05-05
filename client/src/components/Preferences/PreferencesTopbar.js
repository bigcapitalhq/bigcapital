import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardTopbarUser from 'components/Dashboard/TopbarUser';
import UsersActions from 'containers/Dashboard/Preferences/UsersActions';
import CurrenciesActions from 'containers/Dashboard/Preferences/CurrenciesActions';


export default function PreferencesTopbar() {
  return (
    <div class="dashboard__preferences-topbar">
      <h2>Accounts</h2>

      <div class="preferences__topbar-actions">
        <Route pathname="/dashboard/preferences">
          <Switch>
            <Route
              exact
              path={'/dashboard/preferences/users'}
              component={UsersActions} />

            <Route
              exact
              path={'/dashboard/preferences/currencies'}
              component={CurrenciesActions} />
          </Switch>
        </Route>
      </div>

      <div class="dashboard__topbar-user">
        <DashboardTopbarUser />
      </div>
    </div>
  );
}