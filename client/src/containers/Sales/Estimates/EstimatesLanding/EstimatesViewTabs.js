import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import withEstimatesActions from './withEstimatesActions';
import withEstimates from './withEstimates';

import { useEstimatesListContext } from './EstimatesListProvider';
import { compose } from 'utils';

/**
 * Estimates views tabs.
 */
function EstimateViewTabs({
  // #withEstimatesActions
  setEstimatesTableState,

  // #withEstimates
  estimatesTableState
}) {
  // Estimates list context.
  const { estimatesViews } = useEstimatesListContext();
 
  // Estimates views.
  const tabs = estimatesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handle tab change.
  const handleTabsChange = (customViewId) => {
    setEstimatesTableState({ customViewId: customViewId || null });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewId={estimatesTableState.customViewId}
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
  withEstimates(({ estimatesTableState }) => ({ estimatesTableState })),
)(EstimateViewTabs);
