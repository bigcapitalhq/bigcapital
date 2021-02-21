import React from 'react';

import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import { useBillsListContext } from './BillsListProvider';
import withBillActions from './withBillsActions';
import withBills from './withBills';

import { compose } from 'utils';

/**
 * Bills view tabs.
 */
function BillViewTabs({
  // #withBillActions
  setBillsTableState,

  // #withBills
  billsTableState
}) {
  // Bills list context.
  const { billsViews } = useBillsListContext();

  // Handle tab chaging.
  const handleTabsChange = (customView) => {
    setBillsTableState({
      customViewId: customView || null,
    });
  };

  const tabs = billsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewId={billsTableState.customViewId}
          resourceName={'bills'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withBillActions,
  withBills(({ billsTableState }) => ({ billsTableState }))
)(BillViewTabs);
