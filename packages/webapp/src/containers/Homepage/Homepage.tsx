import React, { useEffect } from 'react';
import { HomepageContent } from './HomepageContent';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { DashboardInsider } from '@/components/Dashboard';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { useCurrentOrganizationName } from '@/hooks/query';

type DashboardHomepageProps = WithDashboardActionsProps;

/**
 * Dashboard homepage.
 */
function DashboardHomepage({
  // #withDashboardActions
  changePageTitle,
}: DashboardHomepageProps) {
  const organizationName = useCurrentOrganizationName();

  useEffect(() => {
    changePageTitle(organizationName);
  }, [organizationName, changePageTitle]);

  return (
    <DashboardInsider name="homepage">
      <HomepageContent />
    </DashboardInsider>
  );
}

export const Homepage = withDashboardActions(DashboardHomepage);
