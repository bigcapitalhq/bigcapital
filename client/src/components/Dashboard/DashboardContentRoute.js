import React, { useEffect, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from 'routes/dashboard';

import DashboardPage from './DashboardPage';

/**
 * Dashboard content route.
 */
export default function DashboardContentRoute() {
  return (
    <Route pathname="/">
      <Switch>
        {routes.map((route, index) => (
          <Route
            exact={route.exact}
            key={index}
            path={`${route.path}`}
          >
            <DashboardPage
              Component={route.component}
              pageTitle={route.pageTitle}
              backLink={route.backLink}
              sidebarShrink={route.sidebarShrink}
            />
          </Route>
        ))}
      </Switch>
    </Route>
  );
}
