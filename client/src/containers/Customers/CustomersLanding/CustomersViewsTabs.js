import React, { useMemo } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import withCustomers from './withCustomers';
import withCustomersActions from './withCustomersActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { useCustomersListContext } from './CustomersListProvider';
import { compose } from 'utils';

/**
 * Customers views tabs.
 */
function CustomersViewsTabs({
  // #withCustomersActions
  setCustomersTableState,

  // #withCustomers
  customersTableState,
}) {
  // Customers list context.
  const { customersViews } = useCustomersListContext();

  const tabs = useMemo(
    () =>
      customersViews.map((view) => pick(view, ['name', 'id']), [
        customersViews,
      ]),
    [customersViews],
  );

  // Handle tabs change.
  const handleTabsChange = (viewId) => {
    setCustomersTableState({
      customViewId: viewId || null,
    });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          customViewId={customersTableState.customViewId}
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
  withCustomers(({ customersTableState }) => ({ customersTableState })),
)(CustomersViewsTabs);
