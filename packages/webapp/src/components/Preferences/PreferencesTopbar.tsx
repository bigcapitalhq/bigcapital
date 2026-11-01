// @ts-nocheck
import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardTopbarUser from '@/components/Dashboard/TopbarUser';
import { CLASSES } from '@/constants/classes';
import { Features } from '@/constants/features';
import { withDashboard } from '@/containers/Dashboard/withDashboard';
import { ApiKeysActions } from '@/containers/Preferences/ApiKeys/ApiKeysActions';
import { BranchesActions } from '@/containers/Preferences/Branches/BranchesActions';
import { CurrenciesActions } from '@/containers/Preferences/Currencies/CurrenciesActions';
import { TrackingCategoriesActions } from '@/containers/Preferences/TrackingCategories/TrackingCategoriesActions';
import { UsersActions } from '@/containers/Preferences/Users/UsersActions';
import { WarehousesActions } from '@/containers/Preferences/Warehouses/WarehousesActions';
import { useFeatureCan } from '@/hooks/state';
import '@/style/pages/Preferences/Topbar.scss';

/**
 * Preferences topbar.
 */
function PreferencesTopbar({ preferencesPageTitle }) {
  const { featureCan } = useFeatureCan();

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
            {featureCan(Features.TrackingCategories) && (
              <Route
                exact
                path={'/preferences/tracking-categories'}
                component={TrackingCategoriesActions}
              />
            )}
            <Route
              exact
              path={'/preferences/api-keys'}
              component={ApiKeysActions}
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

export default FF.pipe(
  PreferencesTopbar,
  withDashboard(({ preferencesPageTitle }) => ({ preferencesPageTitle })),
);
