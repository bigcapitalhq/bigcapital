import React, { useEffect, useMemo } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { compose } from 'redux';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { DashboardViewsTabs } from 'components';

import withCustomers from 'containers/Customers/withCustomers';
import withCustomersActions from 'containers/Customers/withCustomersActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
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

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  const tabs = useMemo(() => customersViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }), [customersViews]));

  useEffect(() => {
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');
    addCustomersTableQueries({
      custom_view_id: customViewId,
    });
    return () => {
      setTopbarEditView(null);
      changePageSubtitle('');
    };
  }, [customViewId]);

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'customers'}
          tabs={tabs}
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
  withCustomers(({ customersViews }) => ({
    customersViews,
  })),
)(CustomersViewsTabs);