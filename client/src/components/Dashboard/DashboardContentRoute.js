import React from 'react';
import { Route, Switch  } from 'react-router-dom';
import routes from 'routes/dashboard'
import Breadcrumbs from 'components/Breadcrumbs';

export default function DashboardContentRoute() {

  return (
    <Route pathname="/">
      <Breadcrumbs/>
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