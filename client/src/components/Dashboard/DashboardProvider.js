import React from 'react';
import DashboardLoadingIndicator from './DashboardLoadingIndicator';

/**
 * Dashboard provider.
 */
export default function DashboardProvider({ children }) {
  return (
    <DashboardLoadingIndicator isLoading={false}>
      { children }
    </DashboardLoadingIndicator>
  )
}