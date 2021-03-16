import React from 'react';
import DashboardLoadingIndicator from './DashboardLoadingIndicator';
import { useSettings } from 'hooks/query';

/**
 * Dashboard provider.
 */
export default function DashboardProvider({ children }) {
  const { isLoading } = useSettings();

  return (
    <DashboardLoadingIndicator isLoading={isLoading}>
      { children }
    </DashboardLoadingIndicator>
  )
}