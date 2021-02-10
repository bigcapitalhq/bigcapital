import React, { useMemo } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { compose } from 'redux';

import { useVendorsListContext } from './VendorsListProvider';
import { DashboardViewsTabs } from 'components';

import withVendorsActions from './withVendorsActions';
import withVendors from './withVendors';
import { pick } from 'lodash';

/**
 * Vendors views tabs.
 */
function VendorViewsTabs({
  // #withVendorsActions
  setVendorsTableState,

  // #withVendors
  vendorsTableState
}) {
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
    setVendorsTableState({
      customViewId: viewId || null,
    });
  };
  
  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          customViewId={vendorsTableState.customViewId}
          resourceName={'vendors'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withVendorsActions,
  withVendors(({ vendorsTableState }) => ({ vendorsTableState }))
)(VendorViewsTabs);
