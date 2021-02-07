import React from 'react';

import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';

import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import withEstimateActions from './withEstimateActions';

import { useEstimatesListContext } from './EstimatesListProvider';
import { compose } from 'utils';

/**
 * Estimates views tabs.
 */
function EstimateViewTabs({
  //#withEstimatesActions
  addEstimatesTableQueries,
}) {
  const { custom_view_id: customViewId = null } = useParams();

  // Estimates list context.
  const { estimatesViews } = useEstimatesListContext();
 
  const tabs = estimatesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleTabsChange = (viewId) => {
    addEstimatesTableQueries({
      custom_view_id: viewId || null,
    });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'estimates'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withEstimateActions,
)(EstimateViewTabs);
