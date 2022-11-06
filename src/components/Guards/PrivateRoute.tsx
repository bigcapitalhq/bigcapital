// @ts-nocheck
import React from 'react';
import BodyClassName from 'react-body-classname';
import { Redirect } from 'react-router-dom';
import { useIsAuthenticated } from '@/hooks/state';

export default function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = useIsAuthenticated();

  return (
    <BodyClassName className={''}>
      {isAuthenticated ? (
        <Component />
      ) : (
        <Redirect to={{ pathname: '/auth/login' }} />
      )}
    </BodyClassName>
  );
}
