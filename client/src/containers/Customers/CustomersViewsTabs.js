import React, { useEffect, useMemo } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { compose } from 'redux';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { DashboardViewsTabs } from 'components';

import withCustomers from 'containers/Customers/withCustomers';
import withCustomersActions from 'containers/Customers/withCustomersActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetail from 'containers/Views/withViewDetails';
import { pick } from 'lodash';

/**
 * Customers views tabs.
 */
function CustomersViewsTabs({
  // #withViewDetail
  viewId,
  viewItem,

  // #withCustomers
  customersViews,

  // #withCustomersActions
  addCustomersTableQueries,
  changeCustomerView,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,
}) {
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');
    setTopbarEditView(customViewId);
  }, [customViewId]);
  
  const tabs = useMemo(() =>
    customersViews.map(
      (view) => ({
        ...pick(view, ['name', 'id']),
      }),
      [customersViews],
    ),
  );

  const handleTabsChange = (viewId) => {
    changeCustomerView(viewId || -1);
    addCustomersTableQueries({
      custom_view_id: viewId || null,
    });
    setTopbarEditView(viewId);
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

const mapStateToProps = (state, ownProps) => ({
  viewId: ownProps.match.params.custom_view_id,
});

const withCustomersViewsTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withDashboardActions,
  withCustomersViewsTabs,
  withCustomersActions,
  withViewDetail(),
  withCustomers(({ customersViews }) => ({
    customersViews,
  })),
)(CustomersViewsTabs);
