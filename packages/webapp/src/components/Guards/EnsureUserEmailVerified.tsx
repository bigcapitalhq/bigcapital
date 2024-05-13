import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthUserVerified } from '@/hooks/state';

interface EnsureUserEmailVerifiedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Higher Order Component to ensure that the user's email is verified.
 * If not verified, redirects to the email verification page.
 */
export function EnsureUserEmailVerified({
  children,
  redirectTo = '/auth/register/verify',
}: EnsureUserEmailVerifiedProps) {
  const isAuthVerified = useAuthUserVerified();

  if (!isAuthVerified) {
    return <Redirect to={{ pathname: redirectTo }} />;
  }
  return <>{children}</>;
}
