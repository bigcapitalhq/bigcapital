// @ts-nocheck
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import { useReceiptsListContext } from './ReceiptsListProvider';
import { withReceipts } from './withReceipts';
import { withReceiptActions } from './withReceiptsActions';
import { DashboardViewsTabs } from '@/components';
import { compose, transfromViewsToTabs } from '@/utils';

/**
 * Receipts views tabs.
 */
function ReceiptViewTabsInner({
  // #withReceiptActions
  setReceiptsTableState,

  // #withReceipts
  receiptsCurrentView,
}) {
  // Receipts list context.
  const { receiptsViews } = useReceiptsListContext();

  const tabs = transfromViewsToTabs(receiptsViews);

  // Handles the active tab chaning.
  const handleTabsChange = (viewSlug) => {
    setReceiptsTableState({
      viewSlug: viewSlug || null,
    });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={receiptsCurrentView}
          tabs={tabs}
          resourceName={'receipts'}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const ReceiptViewTabs = compose(
  withReceiptActions,
  withReceipts(({ receiptTableState }) => ({
    receiptsCurrentView: receiptTableState.viewSlug,
  })),
)(ReceiptViewTabsInner);
