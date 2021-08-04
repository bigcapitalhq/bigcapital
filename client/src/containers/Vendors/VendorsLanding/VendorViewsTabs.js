import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { compose } from 'redux';

import { useVendorsListContext } from './VendorsListProvider';
import { DashboardViewsTabs } from 'components';

import withVendorsActions from './withVendorsActions';
import withVendors from './withVendors';

import { transfromViewsToTabs } from 'utils';

/**
 * Vendors views tabs.
 */
function VendorViewsTabs({
  // #withVendorsActions
  setVendorsTableState,

  // #withVendors
  vendorsCurrentView,
}) {
  const { vendorsViews } = useVendorsListContext();

  const tabs = transfromViewsToTabs(vendorsViews);

  const handleTabsChange = (viewSlug) => {
    setVendorsTableState({
      viewSlug: viewSlug || null,
    });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={vendorsCurrentView}
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
  withVendors(({ vendorsTableState }) => ({
    vendorsCurrentView: vendorsTableState.viewSlug,
  })),
)(VendorViewsTabs);
