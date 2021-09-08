import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from 'utils';

import { DataTable, DashboardContentTable } from 'components';
import EstimatesEmptyStatus from './EstimatesEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withEstimatesActions from './withEstimatesActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { useEstimatesListContext } from './EstimatesListProvider';
import { ActionsMenu, useEstiamtesTableColumns } from './components';

/**
 * Estimates datatable.
 */
function EstimatesDataTable({
  // #withEstimatesActions
  setEstimatesTableState,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,
}) {
  const history = useHistory();

  // Estimates list context.
  const {
    estimates,
    pagination,
    isEmptyStatus,
    isEstimatesLoading,
    isEstimatesFetching,
  } = useEstimatesListContext();

  // Estimates table columns.
  const columns = useEstiamtesTableColumns();

  // Handle estimate edit action.
  const handleEditEstimate = (estimate) => {
    history.push(`/estimates/${estimate.id}/edit`);
  };
  // Handle estimate delete action.
  const handleDeleteEstimate = ({ id }) => {
    openAlert('estimate-delete', { estimateId: id });
  };

  // Handle cancel/confirm estimate deliver.
  const handleDeliverEstimate = ({ id }) => {
    openAlert('estimate-deliver', { estimateId: id });
  };

  // Handle cancel/confirm estimate approve.
  const handleApproveEstimate = ({ id }) => {
    openAlert('estimate-Approve', { estimateId: id });
  };

  // Handle cancel/confirm estimate reject.
  const handleRejectEstimate = ({ id }) => {
    openAlert('estimate-reject', { estimateId: id });
  };

  // Handle drawer estimate.
  const handleDrawerEstimate = ({ id }) => {
    openDrawer('estimate-drawer', { estimateId: id });
  };

  // Handle convent to invoice.
  const handleConvertToInvoice = ({ id }) => {
    history.push(`/invoices/new?from_estimate_id=${id}`, { action: id });
  };

  // Handle view detail estimate.
  const handleViewDetailEstimate = ({ id }) => {
    openDrawer('estimate-detail-drawer', { estimateId: id });
  };

  // Handle print estimate.
  const handlePrintEstimate = ({ id }) => {
    openDialog('estimate-pdf-preview', { estimateId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('estimate-detail-drawer', { estimateId: cell.row.original.id });
  };
  // Handles fetch data.
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      setEstimatesTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setEstimatesTableState],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <EstimatesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={estimates}
        loading={isEstimatesLoading}
        headerLoading={isEstimatesLoading}
        progressBarLoading={isEstimatesFetching}
        onFetchData={handleFetchData}
        noInitialFetch={true}
        manualSortBy={true}
        selectionColumn={true}
        sticky={true}
        pagination={true}
        manualPagination={true}
        pagesCount={pagination.pagesCount}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        payload={{
          onApprove: handleApproveEstimate,
          onEdit: handleEditEstimate,
          onReject: handleRejectEstimate,
          onDeliver: handleDeliverEstimate,
          onDelete: handleDeleteEstimate,
          onDrawer: handleDrawerEstimate,
          onConvert: handleConvertToInvoice,
          onViewDetails: handleViewDetailEstimate,
          onPrint: handlePrintEstimate,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withEstimatesActions,
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
)(EstimatesDataTable);
