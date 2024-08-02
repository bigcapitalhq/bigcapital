// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';

import { getDashboardRoutes } from '@/routes/dashboard';
import DashboardPage from './DashboardPage';

/**
 * Dashboard inner route content.
 */
function DashboardContentRouteContent({ route }) {
  return (
    <DashboardPage
      name={route.name}
      Component={route.component}
      pageTitle={route.pageTitle}
      backLink={route.backLink}
      hint={route.hint}
      sidebarExpand={route.sidebarExpand}
      pageType={route.pageType}
      defaultSearchResource={route.defaultSearchResource}
    />
  );
}

/**
 * Dashboard content route.
 */
export default function DashboardContentRoute() {
  const routes = getDashboardRoutes();

  return (
    <Route pathname="/">
      <Switch>
        {routes.map((route, index) => (
          <CompatRoute exact={route.exact} key={index} path={`${route.path}`}>
            <DashboardContentRouteContent route={route} />
          </CompatRoute>
        ))}
      </Switch>
    </Route>
  );
}
