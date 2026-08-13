// @ts-nocheck
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useReceiptsTableColumns, ActionsMenu } from './components';
import { ReceiptsEmptyStatus } from './ReceiptsEmptyStatus';
import { useReceiptsListContext } from './ReceiptsListProvider';
import { withReceipts } from './withReceipts';
import { withReceiptsActions } from './withReceiptsActions';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

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
}) {
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
  const receiptsTableSize = receiptSettings?.tableSize;

  // Receipts table columns.
  const columns = useReceiptsTableColumns();

  // Handle receipt edit action.
  const handleEditReceipt = ({ id }) => {
    history.push(`/receipts/${id}/edit`);
  };

  // Handles receipt delete action.
  const handleDeleteReceipt = (receipt) => {
    openAlert('receipt-delete', { receiptId: receipt.id });
  };

  // Handles receipt close action.
  const handleCloseReceipt = (receipt) => {
    openAlert('receipt-close', { receiptId: receipt.id });
  };

  // Handle view detail receipt.
  const handleViewDetailReceipt = ({ id }) => {
    openDrawer(DRAWERS.RECEIPT_DETAILS, { receiptId: id });
  };

  // Handle print receipt.
  const handlePrintInvoice = ({ id }) => {
    openDialog('receipt-pdf-preview', { receiptId: id });
  };

  // Handle send mail receipt.
  const handleSendMailReceipt = ({ id }) => {
    openDrawer(DRAWERS.RECEIPT_SEND_MAIL, { receiptId: id });
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.RECEIPTS);

  // Handles the datable fetch data once the state changing.
  const handleDataTableFetchData = useCallback(
    ({ sortBy, pageIndex, pageSize }) => {
      setReceiptsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setReceiptsTableState],
  );
  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.RECEIPT_DETAILS, { receiptId: cell.row.original.id });
  };
  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      const selectedIds = selectedRows?.map((row) => row.original.id) || [];
      setReceiptsSelectedRows(selectedIds);
    },
    [setReceiptsSelectedRows],
  );

  if (isEmptyStatus) {
    return <ReceiptsEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={receipts ?? []}
        loading={isReceiptsLoading}
        headerLoading={isReceiptsLoading}
        progressBarLoading={isReceiptsFetching}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        initialPageSize={receiptTableState?.pageSize ?? 10}
        rowsCount={pagination?.total ?? 0}
        manualPagination={true}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={receiptsTableSize}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={receiptSelectedRows}
        autoResetSelectedRows={false}
        payload={{
          onEdit: handleEditReceipt,
          onDelete: handleDeleteReceipt,
          onClose: handleCloseReceipt,
          onViewDetails: handleViewDetailReceipt,
          onPrint: handlePrintInvoice,
          onSendMail: handleSendMailReceipt,
        }}
      />
    </DashboardContentTable>
  );
}

export const ReceiptsTable = compose(
  withAlertActions,
  withReceiptsActions,
  withDrawerActions,
  withDialogActions,
  withReceipts(({ receiptTableState, receiptSelectedRows }) => ({
    receiptTableState,
    receiptSelectedRows,
  })),
)(ReceiptsDataTable);
