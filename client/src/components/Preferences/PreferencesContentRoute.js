import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import preferencesRoutes from 'routes/preferences'

export default function DashboardContentRoute() {
  const { path } = useRouteMatch();

  return (
    <Route pathname="/dashboard/preferences">
      <Switch>
        { preferencesRoutes.map((route, index) => (
          <Route
            key={index}
            path={`${path}/${route.path}`}
            exact={route.exact}
            component={route.component}
          />          
        ))}
      </Switch>
    </Route>
  );
}