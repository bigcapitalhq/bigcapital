// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { getPreferenceRoutes } from '@/routes/preferences';

export default function DashboardContentRoute() {
  const preferencesRoutes = getPreferenceRoutes();

  return (
    <Route pathname="/preferences">
      <Switch>
        {preferencesRoutes.map((route, index) => (
          <Route
            key={index}
            path={`${route.path}`}
            exact={route.exact}
            component={route.component}
          />
        ))}
      </Switch>
    </Route>
  );
}
