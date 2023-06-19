// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';
import { useCustomersListContext } from './CustomersListProvider';
import { compose, transformViewsToTabs } from '@/utils';

import withCustomers from './withCustomers';
import withCustomersActions from './withCustomersActions';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';


/**
 * Customers views tabs.
 */
function CustomersViewsTabs({
  // #withCustomersActions
  setCustomersTableState,

  // #withCustomers
  customersCurrentView,
}) {
  // Customers list context.
  const { customersViews } = useCustomersListContext();

  // Transformes the views to tabs.
  const tabs = transformViewsToTabs(customersViews);

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

export default compose(
  withDashboardActions,
  withCustomersActions,
  withCustomers(({ customersTableState }) => ({
    customersCurrentView: customersTableState.viewSlug,
  })),
)(CustomersViewsTabs);
