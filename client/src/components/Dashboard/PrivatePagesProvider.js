import React from 'react';
import DashboardLoadingIndicator from 'components/Dashboard/DashboardLoadingIndicator';
import { useCurrentOrganization } from '../../hooks/query/organization';

/**
 * Private pages provider.
 */
export function PrivatePagesProvider({ children }) {
  // Fetches the current user's organization.
  const { isLoading } = useCurrentOrganization();

  return (
    <DashboardLoadingIndicator isLoading={isLoading}>
      {children}
    </DashboardLoadingIndicator>
  )
}