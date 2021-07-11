import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { getDashboardRoutes } from 'routes/dashboard';
import DashboardPage from './DashboardPage';

/**
 * Dashboard content route.
 */
export default function DashboardContentRoute() {
  const routes = getDashboardRoutes();

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
              name={route.name}
              Component={route.component}
              pageTitle={route.pageTitle}
              backLink={route.backLink}
              hint={route.hint}
              sidebarExpand={route.sidebarExpand}
              pageType={route.pageType}
            />
          </Route>
        ))}
      </Switch>
    </Route>
  );
}
