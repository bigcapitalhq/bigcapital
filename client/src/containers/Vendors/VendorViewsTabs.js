import React, { useEffect, useMemo } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { compose } from 'redux';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { DashboardViewsTabs } from 'components';

import withVendors from './withVendors';
import withVendorActions from './withVendorActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetail from 'containers/Views/withViewDetails';
import { pick } from 'lodash';

/**
 * Vendors views tabs.
 */
function VendorViewsTabs({
  // #withViewDetail
  viewId,
  viewItem,

  // #withVendors
  vendorViews,

  // #withVendorActions
  addVendorsTableQueries,
  changeVendorView,

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
    vendorViews.map(
      (view) => ({
        ...pick(view, ['name', 'id']),
      }),
      [vendorViews],
    ),
  );

  const handleTabsChange = (viewId) => {
    changeVendorView(viewId || -1);
    addVendorsTableQueries({
      custom_view_id: viewId || null,
    });
  };
  
  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'vendors'}
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


const withVendorsViewsTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withDashboardActions,
  withVendorsViewsTabs,
  withVendorActions,
  withViewDetail(),
  withVendors(({ vendorViews }) => ({ vendorViews })),
)(VendorViewsTabs);
