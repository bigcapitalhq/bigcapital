import React from 'react';
import { DashboardAbilityProvider } from '../../components';

/**
 * Dashboard provider.
 */
export default function DashboardProvider({ children }) {
  return <DashboardAbilityProvider>{children}</DashboardAbilityProvider>;
}
