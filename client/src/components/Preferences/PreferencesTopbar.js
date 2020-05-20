import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardTopbarUser from 'components/Dashboard/TopbarUser';
import UsersActions from 'containers/Preferences/Users/UsersActions';
import CurrenciesActions from 'containers/Preferences/Currencies/CurrenciesActions';


export default function PreferencesTopbar() {
  return (
    <div class="dashboard__preferences-topbar">
      <h2>Accounts</h2>

      <div class="preferences__topbar-actions">
        <Route pathname="/preferences">
          <Switch>
            <Route
              exact
              path={'/preferences/users'}
              component={UsersActions} />

            <Route
              exact
              path={'/preferences/currencies'}
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