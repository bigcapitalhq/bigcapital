import React from 'react';
import { Route, Switch } from 'react-router-dom';
import dashboardRoutes from 'routes/dashboard'

export default function() {
  return (
    <Switch>
      { dashboardRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      ))}
    </Switch>
  )
}