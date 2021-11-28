import React from 'react';
import { DashboardAbilityProvider } from '../../components';
import { useDashboardBoot } from './DashboardBoot';

/**
 * Dashboard provider.
 */
export default function DashboardProvider({ children }) {
  const { isLoading } = useDashboardBoot();

  // Avoid display any dashboard component before complete booting.
  if (isLoading) {
    return null;
  }
  return <DashboardAbilityProvider>{children}</DashboardAbilityProvider>;
}
