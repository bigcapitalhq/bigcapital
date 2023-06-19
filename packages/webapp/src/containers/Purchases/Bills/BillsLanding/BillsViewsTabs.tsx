// @ts-nocheck
import React from 'react';

import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { DashboardViewsTabs } from '@/components';
import { useBillsListContext } from './BillsListProvider';

import withBills from './withBills';
import withBillActions from './withBillsActions';

import { compose, transfromViewsToTabs } from '@/utils';

/**
 * Bills view tabs.
 */
function BillViewTabs({
  // #withBillActions
  setBillsTableState,

  // #withBills
  billsCurrentView,
}) {
  // Bills list context.
  const { billsViews } = useBillsListContext();

  // Handle tab changing.
  const handleTabsChange = (viewSlug) => {
    setBillsTableState({
      viewSlug: viewSlug || null,
    });
  };

  const tabs = transfromViewsToTabs(billsViews);

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={billsCurrentView}
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
  withBills(({ billsTableState }) => ({
    billsCurrentView: billsTableState.viewSlug,
  })),
)(BillViewTabs);
