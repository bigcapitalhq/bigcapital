import React from 'react';

import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import { useBillsListContext } from './BillsListProvider';
import withBillActions from './withBillActions';

import { compose } from 'utils';

/**
 * Bills view tabs.
 */
function BillViewTabs({
  //#withBillActions
  addBillsTableQueries,
}) {
  const { custom_view_id: customViewId = null } = useParams();

  // Bills list context.
  const { billsViews } = useBillsListContext();

  const handleTabsChange = (viewId) => {
    addBillsTableQueries({
      custom_view_id: customViewId || null,
    });
  };

  const tabs = billsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'bills'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(withBillActions)(BillViewTabs);
