// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { DashboardViewsTabs } from '@/components';
import { withWarehouseTransfers } from './withWarehouseTransfers';
import { withWarehouseTransfersActions } from './withWarehouseTransfersActions';
import { useWarehouseTranfersListContext } from './WarehouseTransfersListProvider';
import { transfromViewsToTabs } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Warehouse transfer view tabs.
 */
function WarehouseTransfersViewTabsInner({
  // #withWarehouseTransfers
  warehouseTransferCurrentView,

  // #withWarehouseTransfersActions
  setWarehouseTransferTableState,
}) {
  const { WarehouseTransferView } = useWarehouseTranfersListContext();

  const tabs = transfromViewsToTabs(WarehouseTransferView);

  // Handles click a new view tab.
  const handleClickNewView = () => {};

  // Handles the active tab chaing.
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

export const WarehouseTransfersViewTabs = flow(
  withWarehouseTransfers(({ warehouseTransferTableState }) => ({
    warehouseTransferCurrentView: warehouseTransferTableState?.viewSlug,
  })),
  withWarehouseTransfersActions,
)(WarehouseTransfersViewTabsInner);
