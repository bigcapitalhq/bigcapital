// @ts-nocheck
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useIsAuthenticated } from '@/hooks/state';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function EnsureAuthNotAuthenticated({ children }: PrivateRouteProps) {
  const isAuthenticated = useIsAuthenticated();

  return !isAuthenticated ? children : <Redirect to={{ pathname: '/' }} />;
}
