import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import preferencesRoutes from 'routes/preferences'


export default function DashboardContentRoute() {
  const defaultTab = '/dashboard/preferences/general';

  return (
    <Route pathname="/dashboard/preferences">
      <Redirect from='/dashboard/preferences' to={defaultTab} />

      <Switch>
        { preferencesRoutes.map((route, index) => (
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