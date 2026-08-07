import { Intent } from '@blueprintjs/core';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { DashboardAbilityProvider, AppToaster } from '../../components';
import { useDashboardMetaBoot } from './DashboardBoot';

interface DashboardProviderProps {
  children?: React.ReactNode;
}

/**
 * Dashboard provider.
 */
export default function DashboardProvider({
  children,
}: DashboardProviderProps) {
  const { isLoading } = useDashboardMetaBoot();

  // Show toast when user has switched workspaces
  useEffect(() => {
    const switchedWorkspaceName = sessionStorage.getItem(
      'switchedWorkspaceName',
    );
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
