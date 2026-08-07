// @ts-nocheck
import React, { useEffect } from 'react';
import { HomepageContent } from './HomepageContent';
import { DashboardInsider } from '@/components/Dashboard';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Dashboard homepage.
 */
function DashboardHomepage({
  // #withDashboardActions
  changePageTitle,
}) {
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
