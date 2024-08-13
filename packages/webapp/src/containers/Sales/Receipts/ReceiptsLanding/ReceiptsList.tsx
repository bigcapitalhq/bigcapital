// @ts-nocheck
import React from 'react';
import { DashboardPageContent } from '@/components';

import '@/style/pages/SaleReceipt/List.scss';

import ReceiptActionsBar from './ReceiptActionsBar';
import ReceiptsTable from './ReceiptsTable';

import withReceipts from './withReceipts';
import withReceiptsActions from './withReceiptsActions';

import { ReceiptsListProvider } from './ReceiptsListProvider';
import { transformTableStateToQuery, compose } from '@/utils';

/**
 * Receipts list page.
 */
function ReceiptsList({
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

export default compose(
  withReceipts(({ receiptTableState, receiptsTableStateChanged }) => ({
    receiptTableState,
    receiptsTableStateChanged,
  })),
  withReceiptsActions,
)(ReceiptsList);
