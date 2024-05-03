// @ts-nocheck
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useIsAuthenticated } from '@/hooks/state';

interface EnsureAuthNotAuthenticatedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function EnsureAuthNotAuthenticated({
  children,
  redirectTo = '/',
}: EnsureAuthNotAuthenticatedProps) {
  const isAuthenticated = useIsAuthenticated();

  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Redirect to={{ pathname: redirectTo }} />
  );
}
