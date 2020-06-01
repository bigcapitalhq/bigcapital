import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import DashboardTopbarUser from 'components/Dashboard/TopbarUser';
import UsersActions from 'containers/Preferences/Users/UsersActions';
import CurrenciesActions from 'containers/Preferences/Currencies/CurrenciesActions';
import withDashboard from 'containers/Dashboard/withDashboard';

import { compose } from 'utils';

function PreferencesTopbar({ preferencesPageTitle }) {
  return (
    <div class="dashboard__preferences-topbar">
      <div class="dashboard__title">
        <h2>{preferencesPageTitle}</h2>
      </div>
      <div class="preferences__topbar-actions">
        <Route pathname="/preferences">
          <Switch>
            <Route exact path={'/preferences/users'} component={UsersActions} />

            <Route
              exact
              path={'/preferences/currencies'}
              component={CurrenciesActions}
            />
          </Switch>
        </Route>
      </div>

      <div class="dashboard__topbar-user">
        <DashboardTopbarUser />
      </div>
    </div>
  );
}

export default compose(
  withDashboard(({ preferencesPageTitle }) => ({ preferencesPageTitle })),
)(PreferencesTopbar);
