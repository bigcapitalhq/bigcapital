import React from 'react';
import { DashboardAbilityProvider } from '../../components';
import { useDashboardBoot } from './DashboardBoot';

/**
 * Dashboard provider.
 */
export default function DashboardProvider({ children }) {
  const { isLoading } = useDashboardBoot();

  return (
    <DashboardAbilityProvider>
      {isLoading ? null : children}
    </DashboardAbilityProvider>
  );
}
