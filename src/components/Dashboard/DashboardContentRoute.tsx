import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { getDashboardRoutes } from '@/routes/dashboard';
import EnsureSubscriptionsIsActive from '../Guards/EnsureSubscriptionsIsActive';
import EnsureSubscriptionsIsInactive from '../Guards/EnsureSubscriptionsIsInactive';
import DashboardPage from './DashboardPage';

/**
 * Dashboard inner route content.
 */
function DashboardContentRouteContent({ route }) {
  const content = (
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
  return route.subscriptionActive ? (
    <EnsureSubscriptionsIsInactive
      subscriptionTypes={route.subscriptionActive}
      children={content}
      redirectTo={'/billing'}
    />
  ) : route.subscriptionInactive ? (
    <EnsureSubscriptionsIsActive
      subscriptionTypes={route.subscriptionInactive}
      children={content}
      redirectTo={'/'}
    />
  ) : (
    content
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
          <Route exact={route.exact} key={index} path={`${route.path}`}>
            <DashboardContentRouteContent route={route} />
          </Route>
        ))}
      </Switch>
    </Route>
  );
}
