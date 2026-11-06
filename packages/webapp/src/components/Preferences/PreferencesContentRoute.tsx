// @ts-nocheck
import { Spinner } from '@blueprintjs/core';
import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Box } from '../Layout';
import { useExtensions } from '@/extensions/hooks/useExtensions';
import { extensionRegistry } from '@/extensions/registry';
import { useAbilityContext } from '@/hooks';
import { useFeatureCan } from '@/hooks/state';
import { getPreferenceRoutes } from '@/routes/preferences';

export default function DashboardContentRoute() {
  const { featureCan } = useFeatureCan();
  const ability = useAbilityContext();
  const { enabledIds } = useExtensions();

  const extensionRoutes = extensionRegistry
    .getSettingsTabs(enabledIds)
    .map((tab) => ({
      path: tab.path,
      component: tab.component,
      exact: true,
      feature: tab.feature,
      permission: tab.permission,
    }));

  const preferencesRoutes = [...getPreferenceRoutes(), ...extensionRoutes]
    .filter((route) => !route.feature || featureCan(route.feature))
    .filter(
      (route) =>
        !route.permission ||
        ability.can(route.permission.action, route.permission.subject),
    );

  return (
    <Route pathname="/preferences">
      <Suspense
        fallback={
          <Box style={{ padding: 20 }}>
            <Spinner size={20} />
          </Box>
        }
      >
        <Switch>
          {preferencesRoutes.map((route, index) => (
            <Route
              key={index}
              path={`${route.path}`}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </Switch>
      </Suspense>
    </Route>
  );
}
