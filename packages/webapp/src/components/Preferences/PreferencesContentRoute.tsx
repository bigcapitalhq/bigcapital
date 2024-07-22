// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import preferencesRoutes from '@/routes/preferences';

export default function DashboardContentRoute() {
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
