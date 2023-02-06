// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

import DashboardTopbarUser from '@/components/Dashboard/TopbarUser';
import UsersActions from '@/containers/Preferences/Users/UsersActions';
import CurrenciesActions from '@/containers/Preferences/Currencies/CurrenciesActions';
import WarehousesActions from '@/containers/Preferences/Warehouses/WarehousesActions';
import BranchesActions from '@/containers/Preferences/Branches/BranchesActions';
import withDashboard from '@/containers/Dashboard/withDashboard';

import { compose } from '@/utils';

import '@/style/pages/Preferences/Topbar.scss';

/**
 * Preferences topbar.
 */
function PreferencesTopbar({ preferencesPageTitle }) {
  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_TOPBAR,
        CLASSES.PREFERENCES_TOPBAR,
      )}
    >
      <div class="preferences-topbar__title">
        <h2>{preferencesPageTitle}</h2>
      </div>
      <div class="preferences-topbar__actions">
        <Route pathname="/preferences">
          <Switch>
            <Route exact path={'/preferences/users'} component={UsersActions} />
            <Route
              exact
              path={'/preferences/currencies'}
              component={CurrenciesActions}
            />
            <Route
              exact
              path={'/preferences/warehouses'}
              component={WarehousesActions}
            />
            <Route
              exact
              path={'/preferences/branches'}
              component={BranchesActions}
            />
          </Switch>
        </Route>
      </div>

      <div class="preferences-topbar__user">
        <DashboardTopbarUser />
      </div>
    </div>
  );
}

export default compose(
  withDashboard(({ preferencesPageTitle }) => ({ preferencesPageTitle })),
)(PreferencesTopbar);
