// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';
import { withReceiptActions } from './withReceiptsActions';
import { withReceipts } from './withReceipts';

import { transfromViewsToTabs } from '@/utils';
import { useReceiptsListContext } from './ReceiptsListProvider';
import { flow } from 'fp-ts/function';

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

export const ReceiptViewTabs = flow(
  withReceipts(({ receiptTableState }) => ({
    receiptsCurrentView: receiptTableState.viewSlug,
  })),
  withReceiptActions,
)(ReceiptViewTabsInner);
