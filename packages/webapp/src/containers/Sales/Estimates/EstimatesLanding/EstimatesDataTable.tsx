import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ActionsMenu, useEstimatesTableColumns } from './components';
import { EstimatesEmptyStatus } from './EstimatesEmptyStatus';
import { useEstimatesListContext } from './EstimatesListProvider';
import { withEstimates } from './withEstimates';
import { withEstimatesActions } from './withEstimatesActions';
import type { EstimateTableRow } from './components';
import type { WithEstimatesProps } from './withEstimates';
import type { WithEstimatesActionsProps } from './withEstimatesActions';
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
  tableName: TABLES.ESTIMATES,
  rowName: 'estimate',
  identifierColumn: 'estimate_number',
  ActionsMenu,
});

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

  const columns = useEstimatesTableColumns();

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

  const handleMailSendEstimate = ({ id }: EstimateTableRow) => {
    openDrawer(DRAWERS.ESTIMATE_SEND_MAIL, { estimateId: id });
  };

  if (isEmptyStatus) {
    return <EstimatesEmptyStatus />;
  }

  const actions = {
    onApprove: handleApproveEstimate,
    onEdit: handleEditEstimate,
    onReject: handleRejectEstimate,
    onDeliver: handleDeliverEstimate,
    onDelete: handleDeleteEstimate,
    onConvert: handleConvertToInvoice,
    onViewDetails: handleViewDetailEstimate,
    onPrint: handlePrintEstimate,
    onSendMail: handleMailSendEstimate,
  };

  return (
    <Table
      columns={columns}
      data={estimates}
      total={pagination?.total}
      loading={isEstimatesLoading}
      fetching={isEstimatesFetching}
      compact={estimatesSettings?.tableSize === 'small'}
      query={estimatesTableState}
      setQuery={setEstimatesTableState}
      selectedIds={estimatesSelectedRows}
      setSelectedIds={setEstimatesSelectedRows}
      actions={actions}
    />
  );
}

export const EstimatesDataTable = FF.pipe(
  EstimatesDataTableInner,
  withEstimates(({ estimatesTableState, estimatesSelectedRows }) => ({
    estimatesTableState,
    estimatesSelectedRows,
  })),
  withDialogActions,
  withDrawerActions,
  withAlertActions,
  withEstimatesActions,
);
