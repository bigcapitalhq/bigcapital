import React from 'react';
import { Route, Switch  } from 'react-router-dom';
import routes from 'routes/dashboard'

export default function DashboardContentRoute() {

  return (
    <Route pathname="/dashboard">
      <Switch>
        { routes.map((route, index) => (
          <Route
            exact={route.exact}
            key={index}
            path={`${route.path}`}
            component={route.component} />
        ))}
      </Switch>
    </Route>
  );
}