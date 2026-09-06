import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import { useReceiptsListContext } from './ReceiptsListProvider';
import { withReceipts } from './withReceipts';
import { withReceiptsActions } from './withReceiptsActions';
import type { WithReceiptsProps } from './withReceipts';
import type { WithReceiptsActionsProps } from './withReceiptsActions';
import { DashboardViewsTabs } from '@/components';
import { compose, transfromViewsToTabs } from '@/utils';

interface ReceiptViewTabsProps extends WithReceiptsActionsProps {
  receiptsCurrentView: string;
}

/**
 * Receipts views tabs.
 */
function ReceiptViewTabsInner({
  // #withReceiptActions
  setReceiptsTableState,

  // #withReceipts
  receiptsCurrentView,
}: ReceiptViewTabsProps) {
  // Receipts list context.
  const { receiptsViews } = useReceiptsListContext();

  const tabs = transfromViewsToTabs(receiptsViews);

  // Handles the active tab chaning.
  const handleTabsChange = (viewSlug: string | null) => {
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
  withReceiptsActions,
  withReceipts(({ receiptTableState }: WithReceiptsProps) => ({
    receiptsCurrentView: receiptTableState.viewSlug,
  })),
)(ReceiptViewTabsInner);
