import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from 'utils';

import { DataTable } from 'components';
import EstimatesEmptyStatus from './EstimatesEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withEstimatesActions from './withEstimatesActions';
import withSettings from 'containers/Settings/withSettings';
import withAlertsActions from 'containers/Alert/withAlertActions';

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
      payload={{
        onApprove: handleApproveEstimate,
        onEdit: handleEditEstimate,
        onReject: handleRejectEstimate,
        onDeliver: handleDeliverEstimate,
        onDelete: handleDeleteEstimate,
      }}
    />
  );
}

export default compose(
  withEstimatesActions,
  withAlertsActions,
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(EstimatesDataTable);
