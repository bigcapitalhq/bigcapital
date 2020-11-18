import React, { useEffect, useMemo } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { compose } from 'redux';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { DashboardViewsTabs } from 'components';

import withVendors from './withVendors';
import withVendorActions from './withVendorActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { pick } from 'lodash';

/**
 * Customers views tabs.
 */
function VendorViewsTabs({
  // #withViewDetail
  viewId,
  viewItem,

  // #withVendors
  vendorViews,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,
}) {
  const { custom_view_id: customViewId = null } = useParams();

  const tabs = useMemo(() =>
    vendorViews.map(
      (view) => ({
        ...pick(view, ['name', 'id']),
      }),
      [vendorViews],
    ),
  );

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'vendors'}
          tabs={tabs}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withRouter,
  withDashboardActions,
  withVendors(({ vendorViews }) => ({ vendorViews })),
)(VendorViewsTabs);
