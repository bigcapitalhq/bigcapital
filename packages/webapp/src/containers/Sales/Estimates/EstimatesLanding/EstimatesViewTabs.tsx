// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';

import withEstimatesActions from './withEstimatesActions';
import withEstimates from './withEstimates';

import { useEstimatesListContext } from './EstimatesListProvider';
import { compose, transformViewsToTabs } from '@/utils';

/**
 * Estimates views tabs.
 */
function EstimateViewTabs({
  // #withEstimatesActions
  setEstimatesTableState,

  // #withEstimates
  estimatesCurrentView,
}) {
  // Estimates list context.
  const { estimatesViews } = useEstimatesListContext();
 
  // Estimates views.
  const tabs = transformViewsToTabs(estimatesViews);

  // Handle tab change.
  const handleTabsChange = (viewSlug) => {
    setEstimatesTableState({ viewSlug: viewSlug || null });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={estimatesCurrentView}
          resourceName={'estimates'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withEstimatesActions,
  withEstimates(({ estimatesTableState }) => ({
    estimatesCurrentView: estimatesTableState.viewSlug
  })),
)(EstimateViewTabs);
