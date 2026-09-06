import React from 'react';
import { ReceiptActionsBar } from './ReceiptActionsBar';
import { ReceiptsListDialogs } from './ReceiptsListDialogs';
import { ReceiptsListDrawers } from './ReceiptsListDrawers';
import { ReceiptsListProvider } from './ReceiptsListProvider';
import { ReceiptsTable } from './ReceiptsTable';
import { withReceipts } from './withReceipts';
import { withReceiptsActions } from './withReceiptsActions';
import type { WithReceiptsProps } from './withReceipts';
import { DashboardPageContent } from '@/components';
import '@/style/pages/SaleReceipt/List.scss';
import { transformTableStateToQuery, compose } from '@/utils';

interface WithReceiptsActionsProps {
  resetReceiptsTableState: () => void;
  resetReceiptsSelectedRows: () => void;
}

interface ReceiptsListProps
  extends Pick<
      WithReceiptsProps,
      'receiptTableState' | 'receiptsTableStateChanged'
    >,
    WithReceiptsActionsProps {}

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
}: ReceiptsListProps) {
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
