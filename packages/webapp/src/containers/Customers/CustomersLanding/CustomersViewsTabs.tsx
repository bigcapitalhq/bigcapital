// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';
import { useCustomersListContext } from './CustomersListProvider';
import { transfromViewsToTabs } from '@/utils';

import { withCustomers } from './withCustomers';
import { withCustomersActions } from './withCustomersActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { flow } from 'fp-ts/function';

/**
 * Customers views tabs.
 */
function CustomersViewsTabsInner({
  // #withCustomersActions
  setCustomersTableState,

  // #withCustomers
  customersCurrentView,
}) {
  // Customers list context.
  const { customersViews } = useCustomersListContext();

  // Transformes the views to tabs.
  const tabs = transfromViewsToTabs(customersViews);

  // Handle tabs change.
  const handleTabsChange = (viewSlug) => {
    setCustomersTableState({ viewSlug: viewSlug || null });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={customersCurrentView}
          resourceName={'customers'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const CustomersViewsTabs = flow(
  withCustomers(({ customersTableState }) => ({
    customersCurrentView: customersTableState.viewSlug,
  })),
  withCustomersActions,
  withDashboardActions,
)(CustomersViewsTabsInner);
