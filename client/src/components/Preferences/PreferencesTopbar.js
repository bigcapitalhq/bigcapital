import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardTopbarUser from 'components/Dashboard/TopbarUser';
import UsersActions from 'containers/Preferences/Users/UsersActions';
import CurrenciesActions from 'containers/Preferences/Currencies/CurrenciesActions';
import { compose } from 'utils';
import { connect } from 'react-redux';

function PreferencesTopbar({ pageTitle }) {
  return (
    <div class="dashboard__preferences-topbar">
      {/* <h2>Accounts</h2> */}
      <div class="dashboard__title">
        <h2>{pageTitle}</h2>
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

const mapStateToProps = (state) => ({
  pageTitle: state.dashboard.preferencesPageTitle,
});

export default compose(connect(mapStateToProps))(PreferencesTopbar);
