// @ts-nocheck
import React, { useEffect } from 'react';
import { Intent } from '@blueprintjs/core';
import { DashboardAbilityProvider, AppToaster } from '../../components';
import { useDashboardMetaBoot } from './DashboardBoot';
import intl from 'react-intl-universal';

/**
 * Dashboard provider.
 */
export default function DashboardProvider({ children }) {
  const { isLoading } = useDashboardMetaBoot();

  // Show toast when user has switched workspaces
  useEffect(() => {
    const switchedWorkspaceName = sessionStorage.getItem('switchedWorkspaceName');
    if (switchedWorkspaceName) {
      AppToaster.show({
        message: intl.get('workspace.switched_successfully', {
          name: switchedWorkspaceName,
        }),
        intent: Intent.SUCCESS,
      });
      sessionStorage.removeItem('switchedWorkspaceName');
    }
  }, []);

  // Avoid display any dashboard component before complete booting.
  if (isLoading) {
    return null;
  }
  return <DashboardAbilityProvider>{children}</DashboardAbilityProvider>;
}
