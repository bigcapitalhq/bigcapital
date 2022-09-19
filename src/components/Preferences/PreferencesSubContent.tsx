// @ts-nocheck
import React from 'react';
import preferencesTabs from '@/routes/preferencesTabs';
import {Switch, Route, useRouteMatch} from 'react-router-dom';

export default function PreferencesSubContent({ preferenceTab }) {
  const routes = preferencesTabs[preferenceTab];
  const { path } = useRouteMatch();

  if (routes.length <= 0) { return null; }

  return (
    <Switch>
      { routes.map((route, index) => (
        <Route
          key={index}
          path={`${path}/${route.path}`}
          exact={route.exact}
          component={route.component}
        />          
      ))}
    </Switch>);
}