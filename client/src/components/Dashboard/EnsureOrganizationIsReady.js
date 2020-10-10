import React from 'react';
import { Redirect } from 'react-router-dom';

export default function EnsureOrganizationIsReady({
  children,
}) {
  const isOrganizationReady = false;

  return (isOrganizationReady) ? children : (
    <Redirect
      to={{
        pathname: '/register'
      }}
    />
  );
}