// @ts-nocheck
import React from 'react';
import { DashboardAbilityProvider } from '../../components';
import { useDashboardMetaBoot } from './DashboardBoot';

/**
 * Dashboard provider.
 */
export default function DashboardProvider({ children }) {
  const { isLoading } = useDashboardMetaBoot();

  // Avoid display any dashboard component before complete booting.
  if (isLoading) {
    return null;
  }
  return <DashboardAbilityProvider>{children}</DashboardAbilityProvider>;
}
