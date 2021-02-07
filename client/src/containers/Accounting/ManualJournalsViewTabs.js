import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import { useManualJournalsContext } from './ManualJournalsListProvider';
import withManualJournalsActions from './withManualJournalsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose, saveInvoke } from 'utils';

/**
 * Manual journal views tabs.
 */
function ManualJournalsViewTabs({
  // #withManualJournalsActions
  addManualJournalsTableQueries,
}) {
  const { custom_view_id: customViewId } = useParams();
  const { journalsViews } = useManualJournalsContext();

  const tabs = journalsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleClickNewView = () => {};

  const handleTabChange = (viewId) => {
    addManualJournalsTableQueries({
      custom_view_id: viewId || null,
    });
  };
  
  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          resourceName={'manual-journals'}
          initialViewId={customViewId}
          tabs={tabs}
          onChange={handleTabChange}
          onNewViewTabClick={handleClickNewView}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withManualJournalsActions,
  withDashboardActions,
)(ManualJournalsViewTabs);
