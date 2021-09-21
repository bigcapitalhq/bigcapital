import React from 'react';
import { AuthenticatedUser } from './AuthenticatedUser';

/**
 * Private pages provider.
 */
export function PrivatePagesProvider({ children }) {
  return <AuthenticatedUser>{children}</AuthenticatedUser>;
}
