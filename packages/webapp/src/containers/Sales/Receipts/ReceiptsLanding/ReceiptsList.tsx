// @ts-nocheck
import React from 'react';
import { DashboardPageContent } from '@/components';

import '@/style/pages/SaleReceipt/List.scss';

import { ReceiptActionsBar } from './ReceiptActionsBar';
import { ReceiptsTable } from './ReceiptsTable';

import { withReceipts } from './withReceipts';
import { withReceiptsActions } from './withReceiptsActions';

import { ReceiptsListProvider } from './ReceiptsListProvider';
import { transformTableStateToQuery } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Receipts list page.
 */
function ReceiptsListInner({
  // #withReceipts
  receiptTableState,
  receiptsTableStateChanged,

  // #withReceiptsActions
  resetReceiptsTableState,
}) {
  // Resets the receipts table state once the page unmount.
  React.useEffect(
    () => () => {
      resetReceiptsTableState();
    },
    [resetReceiptsTableState],
  );

  return (
    <ReceiptsListProvider
      query={transformTableStateToQuery(receiptTableState)}
      tableStateChanged={receiptsTableStateChanged}
    >
      <DashboardPageContent>
        <ReceiptActionsBar />

        <DashboardPageContent>
          <ReceiptsTable />
        </DashboardPageContent>
      </DashboardPageContent>
    </ReceiptsListProvider>
  );
}

export const ReceiptsList = flow(
  withReceiptsActions,
  withReceipts(({ receiptTableState, receiptsTableStateChanged }) => ({
    receiptTableState,
    receiptsTableStateChanged,
  })),
)(ReceiptsListInner);
