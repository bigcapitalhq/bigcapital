import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { useExtensions } from '@/extensions/hooks/useExtensions';
import { ExtensionComponentHost } from '@/extensions/host/ExtensionComponentHost';
import { extensionRegistry } from '@/extensions/registry';
import { useAbilityContext } from '@/hooks';
import { useFeatureCan } from '@/hooks/state';
import { getCoreDashboardRoutes } from '@/routes/dashboard';

export interface DashboardRoute {
  path: string;
  component: React.ComponentType;
  extensionId?: string;
  name?: string;
  pageTitle?: string;
  hint?: string;
  backLink?: boolean | string;
  sidebarExpand?: boolean;
  defaultSearchResource?: string;
  exact?: boolean;
  feature?: string;
  permission?: {
    subject: string;
    action: string;
  };
}

/**
 * Dashboard inner route content.
 */
function DashboardContentRouteContent({ route }: { route: DashboardRoute }) {
  const Component = route.extensionId
    ? () => (
        <ExtensionComponentHost
          extensionId={route.extensionId!}
          component={route.component}
        />
      )
    : route.component;

  return (
    <DashboardPage
      name={route.name}
      Component={Component}
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
  const { featureCan } = useFeatureCan();
  const ability = useAbilityContext();
  const { enabledIds } = useExtensions();

  const coreRoutes = getCoreDashboardRoutes() as DashboardRoute[];
  const extensionRoutes = extensionRegistry.getRoutes(enabledIds);
  const fallbackRouteIndex = coreRoutes.findIndex(
    (route) => route.path === '/',
  );

  // The homepage is a catch-all fallback. Extension routes must be inserted
  // before it, otherwise they would never match.
  const routeCandidates =
    fallbackRouteIndex === -1
      ? [...coreRoutes, ...extensionRoutes]
      : [
          ...coreRoutes.slice(0, fallbackRouteIndex),
          ...extensionRoutes,
          ...coreRoutes.slice(fallbackRouteIndex),
        ];

  const routes = routeCandidates
    .filter((route) => !route.feature || featureCan(route.feature))
    .filter(
      (route) =>
        !route.permission ||
        ability.can(route.permission.action, route.permission.subject),
    );

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
