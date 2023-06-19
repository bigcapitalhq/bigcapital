// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { DashboardViewsTabs } from '@/components';

import withWarehouseTransfers from './withWarehouseTransfers';
import withWarehouseTransfersActions from './withWarehouseTransfersActions';
import { useWarehouseTransfersListContext } from './WarehouseTransfersListProvider';
import { compose, transformViewsToTabs } from '@/utils';

/**
 * Warehouse transfer view tabs.
 */
function WarehouseTransfersViewTabs({
  // #withWarehouseTransfers
  warehouseTransferCurrentView,

  // #withWarehouseTransfersActions
  setWarehouseTransferTableState,
}) {
  const { WarehouseTransferView } = useWarehouseTransfersListContext();

  const tabs = transformViewsToTabs(WarehouseTransferView);

  // Handles click a new view tab.
  const handleClickNewView = () => {};

  // Handles the active tab change.
  const handleTabsChange = (viewSlug) => {
    setWarehouseTransferTableState({ viewSlug });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={warehouseTransferCurrentView}
          resourceName={'warehouse_transfer'}
          tabs={tabs}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withWarehouseTransfersActions,
  withWarehouseTransfers(({ warehouseTransferTableState }) => ({
    warehouseTransferCurrentView: warehouseTransferTableState?.viewSlug,
  })),
)(WarehouseTransfersViewTabs);
