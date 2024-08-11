// @ts-nocheck
import React from 'react';
import preferencesTabs from '@/routes/preferencesTabs';
import {Switch, Route, useRouteMatch} from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';

export default function PreferencesSubContent({ preferenceTab }) {
  const routes = preferencesTabs[preferenceTab];
  const { path } = useRouteMatch();

  if (routes.length <= 0) { return null; }

  return (
    <Switch>
      { routes.map((route, index) => (
        <CompatRoute
          key={index}
          path={`${path}/${route.path}`}
          exact={route.exact}
          component={route.component}
        />          
      ))}
    </Switch>);
}