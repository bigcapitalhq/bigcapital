import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { getDashboardRoutes } from '@/routes/dashboard';

export interface DashboardRoute {
  path: string;
  component: React.ComponentType;
  name?: string;
  pageTitle?: string;
  hint?: string;
  backLink?: boolean | string;
  sidebarExpand?: boolean;
  defaultSearchResource?: string;
  exact?: boolean;
}

/**
 * Dashboard inner route content.
 */
function DashboardContentRouteContent({ route }: { route: DashboardRoute }) {
  return (
    <DashboardPage
      name={route.name}
      Component={route.component}
      pageTitle={route.pageTitle}
      backLink={route.backLink}
      hint={route.hint}
      sidebarExpand={route.sidebarExpand}
      defaultSearchResource={route.defaultSearchResource}
    />
  );
}

/**
 * Dashboard content route.
 */
export default function DashboardContentRoute() {
  const routes = getDashboardRoutes() as DashboardRoute[];

  return (
    <Route path="/">
      <Switch>
        {routes.map((route, index) => (
          <Route exact={route.exact} key={index} path={`${route.path}`}>
            <DashboardContentRouteContent route={route} />
          </Route>
        ))}
      </Switch>
    </Route>
  );
}
