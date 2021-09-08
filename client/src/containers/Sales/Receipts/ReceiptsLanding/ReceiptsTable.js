import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from 'utils';
import { DataTable, DashboardContentTable } from 'components';

import ReceiptsEmptyStatus from './ReceiptsEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withReceipts from './withReceipts';
import withReceiptsActions from './withReceiptsActions';

import { useReceiptsListContext } from './ReceiptsListProvider';
import { useReceiptsTableColumns, ActionsMenu } from './components';

/**
 * Sale receipts datatable.
 */
function ReceiptsDataTable({
  // #withReceiptsActions
  setReceiptsTableState,

  // #withReceipts
  receiptTableState,

  // #withAlertsActions
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
  } = useReceiptsListContext();

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

  // Handle drawer receipts.
  const handleDrawerReceipt = ({ id }) => {
    openDrawer('receipt-drawer', { receiptId: id });
  };

  // Handles receipt close action.
  const handleCloseReceipt = (receipt) => {
    openAlert('receipt-close', { receiptId: receipt.id });
  };

  // Handle view detail receipt.
  const handleViewDetailReceipt = ({ id }) => {
    openDrawer('receipt-detail-drawer', { receiptId: id });
  };

  // Handle print receipt.
  const handlePrintInvoice = ({ id }) => {
    openDialog('receipt-pdf-preview', { receiptId: id });
  };

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

  if (isEmptyStatus) {
    return <ReceiptsEmptyStatus />;
  }
  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('receipt-detail-drawer', { receiptId: cell.row.original.id });
  };

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={receipts}
        initialState={receiptTableState}
        loading={isReceiptsLoading}
        headerLoading={isReceiptsLoading}
        progressBarLoading={isReceiptsFetching}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        pagesCount={pagination.pagesCount}
        manualPagination={true}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        payload={{
          onEdit: handleEditReceipt,
          onDelete: handleDeleteReceipt,
          onClose: handleCloseReceipt,
          onDrawer: handleDrawerReceipt,
          onViewDetails: handleViewDetailReceipt,
          onPrint: handlePrintInvoice,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withAlertsActions,
  withReceiptsActions,
  withDrawerActions,
  withDialogActions,
  withReceipts(({ receiptTableState }) => ({
    receiptTableState,
  })),
)(ReceiptsDataTable);
