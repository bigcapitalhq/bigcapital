import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  useReceiptsTableColumns,
  ActionsMenu,
  ReceiptTableRow,
} from './components';
import { ReceiptsEmptyStatus } from './ReceiptsEmptyStatus';
import { useReceiptsListContext } from './ReceiptsListProvider';
import { withReceipts } from './withReceipts';
import { withReceiptsActions } from './withReceiptsActions';
import type { WithReceiptsProps } from './withReceipts';
import type { WithReceiptsActionsProps } from './withReceiptsActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { createSalesListTable } from '@/containers/Sales/SalesListTable';

const Table = createSalesListTable({
  tableName: TABLES.RECEIPTS,
  rowName: 'receipt',
  identifierColumn: 'receipt_number',
  ActionsMenu,
});

interface ReceiptsDataTableProps
  extends Pick<WithReceiptsProps, 'receiptTableState' | 'receiptSelectedRows'>,
    WithReceiptsActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    WithDialogActionsProps {}

/**
 * Sale receipts datatable.
 */
function ReceiptsDataTable({
  // #withReceiptsActions
  setReceiptsTableState,
  setReceiptsSelectedRows,

  // #withReceipts
  receiptTableState,
  receiptSelectedRows,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,
}: ReceiptsDataTableProps) {
  const history = useHistory();

  // Receipts list context.
  const {
    receipts,
    pagination,
    isReceiptsFetching,
    isReceiptsLoading,
    isEmptyStatus,
    receiptSettings,
  } = useReceiptsListContext();

  // Receipts table columns.
  const columns = useReceiptsTableColumns();

  // Handle receipt edit action.
  const handleEditReceipt = ({ id }: ReceiptTableRow) => {
    history.push(`/receipts/${id}/edit`);
  };

  // Handles receipt delete action.
  const handleDeleteReceipt = (receipt: ReceiptTableRow) => {
    openAlert('receipt-delete', { receiptId: receipt.id });
  };

  // Handles receipt close action.
  const handleCloseReceipt = (receipt: ReceiptTableRow) => {
    openAlert('receipt-close', { receiptId: receipt.id });
  };

  // Handle view detail receipt.
  const handleViewDetailReceipt = ({ id }: ReceiptTableRow) => {
    openDrawer(DRAWERS.RECEIPT_DETAILS, { receiptId: id });
  };

  // Handle print receipt.
  const handlePrintInvoice = ({ id }: ReceiptTableRow) => {
    openDialog('receipt-pdf-preview', { receiptId: id });
  };

  // Handle send mail receipt.
  const handleSendMailReceipt = ({ id }: ReceiptTableRow) => {
    openDrawer(DRAWERS.RECEIPT_SEND_MAIL, { receiptId: id });
  };

  if (isEmptyStatus) {
    return <ReceiptsEmptyStatus />;
  }

  const actions = {
    onEdit: handleEditReceipt,
    onDelete: handleDeleteReceipt,
    onClose: handleCloseReceipt,
    onViewDetails: handleViewDetailReceipt,
    onPrint: handlePrintInvoice,
    onSendMail: handleSendMailReceipt,
  };

  return (
    <Table
      columns={columns}
      data={receipts}
      total={pagination?.total}
      loading={isReceiptsLoading}
      fetching={isReceiptsFetching}
      compact={receiptSettings?.tableSize === 'small'}
      query={receiptTableState}
      setQuery={setReceiptsTableState}
      selectedIds={receiptSelectedRows}
      setSelectedIds={setReceiptsSelectedRows}
      actions={actions}
    />
  );
}

export const ReceiptsTable = FF.pipe(
  ReceiptsDataTable,
  withReceipts(({ receiptTableState, receiptSelectedRows }) => ({
    receiptTableState,
    receiptSelectedRows,
  })),
  withDialogActions,
  withDrawerActions,
  withReceiptsActions,
  withAlertActions,
);
