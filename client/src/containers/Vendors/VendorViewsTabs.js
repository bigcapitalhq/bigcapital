import React, { useMemo } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { compose } from 'redux';
import { useParams } from 'react-router-dom';

import { useVendorsListContext } from './VendorsListProvider';
import { DashboardViewsTabs } from 'components';

import withVendorActions from './withVendorActions';
import { pick } from 'lodash';

/**
 * Vendors views tabs.
 */
function VendorViewsTabs({
  // #withVendorActions
  addVendorsTableQueries,
}) {
  const { custom_view_id: customViewId = null } = useParams();
  const { vendorsViews } = useVendorsListContext();
 
  const tabs = useMemo(() =>
    vendorsViews.map(
      (view) => ({
        ...pick(view, ['name', 'id']),
      }),
    ),
    [vendorsViews],
  );

  const handleTabsChange = (viewId) => {
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

export default compose(
  withVendorActions,
)(VendorViewsTabs);
