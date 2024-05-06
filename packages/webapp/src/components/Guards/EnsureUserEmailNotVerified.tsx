import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthUserVerified } from '@/hooks/state';

interface EnsureUserEmailNotVerifiedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Higher Order Component to ensure that the user's email is not verified.
 * If is verified, redirects to the inner setup page.
 */
export function EnsureUserEmailNotVerified({
  children,
  redirectTo = '/',
}: EnsureUserEmailNotVerifiedProps) {
  const isAuthVerified = useAuthUserVerified();

  if (isAuthVerified) {
    return <Redirect to={{ pathname: redirectTo }} />;
  }
  return <>{children}</>;
}
