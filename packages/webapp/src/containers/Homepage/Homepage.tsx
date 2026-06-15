// @ts-nocheck
import React, { useEffect } from 'react';
import { DashboardInsider } from '@/components/Dashboard';

import { HomepageContent } from './HomepageContent';

import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

/**
 * Dashboard homepage.
 */
function DashboardHomepage({
  // #withDashboardActions
  changePageTitle,

  // #withCurrentOrganization
  organization,
}) {
  useEffect(() => {
    changePageTitle(organization.name);
  }, [organization.name, changePageTitle]);

  return (
    <DashboardInsider name="homepage">
      <HomepageContent />
    </DashboardInsider>
  );
}

export const Homepage = flow(
  withCurrentOrganization(({ organization }) => ({ organization })),
  withDashboardActions,
)(DashboardHomepage);
