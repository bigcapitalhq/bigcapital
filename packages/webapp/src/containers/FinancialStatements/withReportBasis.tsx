import React from 'react';
import { resolveReportBasis, ReportBasis } from './reportBasis';
import type { ComponentType } from 'react';
import { DashboardInsider } from '@/components';
import { useSettingsOrganization } from '@/hooks/query';

/**
 * The default basis of the report screens, taken from the organization
 * accounting basis setting. `isResolved` turns true once the setting has
 * loaded (or failed to load, in which case the fallback basis is used).
 */
export function useDefaultReportBasis(): {
  basis: ReportBasis;
  isResolved: boolean;
} {
  const { data, isLoading } = useSettingsOrganization();

  return {
    basis: resolveReportBasis(data?.accountingBasis),
    isResolved: !isLoading,
  };
}

/**
 * Holds the report screen until the organization accounting basis is known,
 * so the first report request already uses the organization's basis instead
 * of fetching on a placeholder basis and then switching.
 */
export function withReportBasis<P extends object>(
  WrappedComponent: ComponentType<P>,
): ComponentType<P> {
  function WithReportBasis(props: P) {
    const { isResolved } = useDefaultReportBasis();

    if (!isResolved) {
      return <DashboardInsider loading={true} />;
    }
    return <WrappedComponent {...props} />;
  }
  return WithReportBasis;
}
