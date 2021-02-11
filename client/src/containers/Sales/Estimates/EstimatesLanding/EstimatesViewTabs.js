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
 
  const tabs = estimatesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleTabsChange = (viewId) => {
    setEstimatesTableState({
      customViewId: viewId || null,
    });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          customViewId={estimatesTableState.customViewId}
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
