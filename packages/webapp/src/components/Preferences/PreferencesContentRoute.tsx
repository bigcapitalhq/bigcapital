// @ts-nocheck
import { Spinner } from '@blueprintjs/core';
import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Box } from '../Layout';
import { getPreferenceRoutes } from '@/routes/preferences';

export default function DashboardContentRoute() {
  const preferencesRoutes = getPreferenceRoutes();

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
