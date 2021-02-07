import React, { useMemo } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { compose } from 'redux';
import { useParams } from 'react-router-dom';

import { DashboardViewsTabs } from 'components';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { pick } from 'lodash';
import { useCustomersListContext } from './CustomersListProvider';

/**
 * Customers views tabs.
 */
function CustomersViewsTabs({
  // #withCustomersActions
  addCustomersTableQueries,
}) {
  const { custom_view_id: customViewId = null } = useParams();
  const { customersViews } = useCustomersListContext();

  const tabs = useMemo(() =>
    customersViews.map(
      (view) => ({
        ...pick(view, ['name', 'id']),
      }),
      [customersViews],
    ),
    [customersViews]
  );

  const handleTabsChange = (viewId) => {
    addCustomersTableQueries({
      custom_view_id: viewId || null,
    });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
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
)(CustomersViewsTabs);
