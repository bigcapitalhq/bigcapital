import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import { useBillsListContext } from './BillsListProvider';
import { withBills } from './withBills';
import { withBillsActions } from './withBillsActions';
import type { WithBillsProps } from './withBills';
import { DashboardViewsTabs } from '@/components';
import { compose, transfromViewsToTabs } from '@/utils';

interface WithBillsActionsProps {
  setBillsTableState: (state: Record<string, any>) => void;
}

interface BillViewTabsProps {
  setBillsTableState: WithBillsActionsProps['setBillsTableState'];
  billsCurrentView: string;
}

function BillViewTabs({
  setBillsTableState,
  billsCurrentView,
}: BillViewTabsProps) {
  const { billsViews } = useBillsListContext();

  const handleTabsChange = (viewSlug: string | null) => {
    setBillsTableState({
      viewSlug: viewSlug || null,
    });
  };

  const tabs = transfromViewsToTabs(billsViews);

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={billsCurrentView}
          resourceName={'bills'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const BillsViewsTabs = compose(
  withBillsActions,
  withBills(({ billsTableState }: WithBillsProps) => ({
    billsCurrentView: billsTableState.viewSlug,
  })),
)(BillViewTabs);
