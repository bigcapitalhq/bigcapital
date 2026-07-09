import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import { useWarehouseTranfersListContext } from './WarehouseTransfersListProvider';
import { withWarehouseTransfers } from './withWarehouseTransfers';
import { withWarehouseTransfersActions } from './withWarehouseTransfersActions';
import type { WithWarehouseTransfersActionsProps } from './withWarehouseTransfersActions';
import { DashboardViewsTabs } from '@/components';
import { compose, transfromViewsToTabs } from '@/utils';

interface WarehouseTransfersViewTabsInnerProps
  extends Pick<
    WithWarehouseTransfersActionsProps,
    'setWarehouseTransferTableState'
  > {
  warehouseTransferCurrentView?: string;
}

/**
 * Warehouse transfer view tabs.
 */
function WarehouseTransfersViewTabsInner({
  // #withWarehouseTransfers
  warehouseTransferCurrentView,

  // #withWarehouseTransfersActions
  setWarehouseTransferTableState,
}: WarehouseTransfersViewTabsInnerProps) {
  const { WarehouseTransferView } = useWarehouseTranfersListContext();

  const tabs = transfromViewsToTabs(WarehouseTransferView);

  // Handles click a new view tab.
  const handleClickNewView = () => {};

  // Handles the active tab chaing.
  const handleTabsChange = (viewSlug: string) => {
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

export const WarehouseTransfersViewTabs = compose(
  withWarehouseTransfersActions,
  withWarehouseTransfers(({ warehouseTransferTableState }) => ({
    warehouseTransferCurrentView: warehouseTransferTableState?.viewSlug,
  })),
)(WarehouseTransfersViewTabsInner);
