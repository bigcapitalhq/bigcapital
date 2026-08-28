import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ActionsMenu, useEstiamtesTableColumns } from './components';
import { EstimatesEmptyStatus } from './EstimatesEmptyStatus';
import { useEstimatesListContext } from './EstimatesListProvider';
import { withEstimates } from './withEstimates';
import { withEstimatesActions } from './withEstimatesActions';
import type { EstimateTableRow } from './components';
import type { WithEstimatesProps } from './withEstimates';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface WithEstimatesActionsProps {
  setEstimatesTableState: (state: Record<string, any>) => void;
  setEstimatesSelectedRows: (ids: number[]) => void;
}

interface EstimatesDataTableProps
  extends Pick<
      WithEstimatesProps,
      'estimatesTableState' | 'estimatesSelectedRows'
    >,
    WithEstimatesActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    WithDialogActionsProps {}

function EstimatesDataTableInner({
  setEstimatesTableState,
  setEstimatesSelectedRows,
  openAlert,
  openDrawer,
  openDialog,
  estimatesTableState,
  estimatesSelectedRows,
}: EstimatesDataTableProps) {
  const history = useHistory();

  const {
    estimates,
    pagination,
    isEmptyStatus,
    isEstimatesLoading,
    isEstimatesFetching,
    estimatesSettings,
  } = useEstimatesListContext();
  const estimatesTableSize = estimatesSettings?.tableSize as string | undefined;

  const columns = useEstiamtesTableColumns();

  const handleEditEstimate = (estimate: EstimateTableRow) => {
    history.push(`/estimates/${estimate.id}/edit`);
  };
  const handleDeleteEstimate = ({ id }: EstimateTableRow) => {
    openAlert('estimate-delete', { estimateId: id });
  };

  const handleDeliverEstimate = ({ id }: EstimateTableRow) => {
    openAlert('estimate-deliver', { estimateId: id });
  };

  const handleApproveEstimate = ({ id }: EstimateTableRow) => {
    openAlert('estimate-Approve', { estimateId: id });
  };

  const handleRejectEstimate = ({ id }: EstimateTableRow) => {
    openAlert('estimate-reject', { estimateId: id });
  };

  const handleConvertToInvoice = ({ id }: EstimateTableRow) => {
    history.push(`/invoices/new?from_estimate_id=${id}`, { action: id });
  };

  const handleViewDetailEstimate = ({ id }: EstimateTableRow) => {
    openDrawer(DRAWERS.ESTIMATE_DETAILS, { estimateId: id });
  };

  const handlePrintEstimate = ({ id }: EstimateTableRow) => {
    openDialog('estimate-pdf-preview', { estimateId: id });
  };

  const handleCellClick = (cell: any, _event: React.MouseEvent) => {
    openDrawer(DRAWERS.ESTIMATE_DETAILS, { estimateId: cell.row.original.id });
  };

  const handleMailSendEstimate = ({ id }: EstimateTableRow) => {
    openDrawer(DRAWERS.ESTIMATE_SEND_MAIL, { estimateId: id });
  };

  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.ESTIMATES);

  const handleFetchData = useCallback(
    ({
      pageIndex,
      pageSize,
      sortBy,
    }: {
      pageSize: number;
      pageIndex: number;
      sortBy: Array<{ id: string; desc: boolean }>;
    }) => {
      setEstimatesTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setEstimatesTableState],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedFlatRows: Array<{ original: EstimateTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setEstimatesSelectedRows(selectedIds);
    },
    [setEstimatesSelectedRows],
  );

  if (isEmptyStatus) {
    return <EstimatesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={estimates ?? []}
        loading={isEstimatesLoading}
        headerLoading={isEstimatesLoading}
        progressBarLoading={isEstimatesFetching}
        onFetchData={handleFetchData}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={estimatesSelectedRows}
        autoResetSelectedRows={false}
        noInitialFetch={true}
        manualSortBy={true}
        selectionColumn={true}
        sticky={true}
        pagination={true}
        initialPageSize={estimatesTableState?.pageSize ?? 10}
        manualPagination={true}
        rowsCount={pagination?.total ?? 0}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        rowTestId={'estimate-row'}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={estimatesTableSize}
        payload={{
          onApprove: handleApproveEstimate,
          onEdit: handleEditEstimate,
          onReject: handleRejectEstimate,
          onDeliver: handleDeliverEstimate,
          onDelete: handleDeleteEstimate,
          onConvert: handleConvertToInvoice,
          onViewDetails: handleViewDetailEstimate,
          onPrint: handlePrintEstimate,
          onSendMail: handleMailSendEstimate,
        }}
      />
    </DashboardContentTable>
  );
}

export const EstimatesDataTable = compose(
  withEstimatesActions,
  withAlertActions,
  withDrawerActions,
  withDialogActions,
  withEstimates(({ estimatesTableState, estimatesSelectedRows }) => ({
    estimatesTableState,
    estimatesSelectedRows,
  })),
)(EstimatesDataTableInner);
