import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';
import withReceiptActions from './withReceiptsActions';
import withReceipts from './withReceipts';

import { compose } from 'utils';
import { useReceiptsListContext } from './ReceiptsListProvider';

/**
 * Receipts views tabs.
 */
function ReceiptViewTabs({
  // #withReceiptActions
  setReceiptsTableState,

  // #withReceipts
  receiptTableState
}) {
  // Receipts list context.
  const { receiptsViews } = useReceiptsListContext();

  const tabs = receiptsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handles the active tab chaning.
  const handleTabsChange = (customViewId) => {
    setReceiptsTableState({
      customViewId: customViewId || null,
    });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewId={receiptTableState.customViewId}
          tabs={tabs}
          resourceName={'receipts'}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withReceiptActions,
  withReceipts(({ receiptTableState }) => ({ receiptTableState })),
)(ReceiptViewTabs);
