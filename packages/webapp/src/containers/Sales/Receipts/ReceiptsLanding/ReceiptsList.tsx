// @ts-nocheck
import React from 'react';
import { DashboardPageContent } from '@/components';

import '@/style/pages/SaleReceipt/List.scss';
import { ReceiptActionsBar } from './ReceiptActionsBar';
import { ReceiptsListDialogs } from './ReceiptsListDialogs';
import { ReceiptsListDrawers } from './ReceiptsListDrawers';
import { ReceiptsListProvider } from './ReceiptsListProvider';
import { ReceiptsTable } from './ReceiptsTable';
import { withReceipts } from './withReceipts';
import { withReceiptsActions } from './withReceiptsActions';
import { transformTableStateToQuery, compose } from '@/utils';

/**
 * Receipts list page.
 */
function ReceiptsListInner({
  // #withReceipts
  receiptTableState,
  receiptsTableStateChanged,

  // #withReceiptsActions
  resetReceiptsTableState,
  resetReceiptsSelectedRows,
}) {
  // Resets the receipts table state and selected rows once the page unmount.
  React.useEffect(
    () => () => {
      resetReceiptsTableState();
      resetReceiptsSelectedRows();
    },
    [resetReceiptsSelectedRows, resetReceiptsTableState],
  );

  return (
    <ReceiptsListProvider
      query={transformTableStateToQuery(receiptTableState)}
      tableStateChanged={receiptsTableStateChanged}
    >
      <ReceiptsListDrawers />
      <ReceiptsListDialogs />

      <DashboardPageContent>
        <ReceiptActionsBar />

        <DashboardPageContent>
          <ReceiptsTable />
        </DashboardPageContent>
      </DashboardPageContent>
    </ReceiptsListProvider>
  );
}

export const ReceiptsList = compose(
  withReceipts(({ receiptTableState, receiptsTableStateChanged }) => ({
    receiptTableState,
    receiptsTableStateChanged,
  })),
  withReceiptsActions,
)(ReceiptsListInner);
