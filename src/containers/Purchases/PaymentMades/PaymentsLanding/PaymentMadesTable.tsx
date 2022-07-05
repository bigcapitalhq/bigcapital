import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from '@/utils';

import { TABLES } from '@/common/tables';
import { DataTable, DashboardContentTable } from '@/components';

import PaymentMadesEmptyStatus from './PaymentMadesEmptyStatus';
import TableSkeletonRows from '@/components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from '@/components/Datatable/TableHeaderSkeleton';

import withPaymentMadeActions from './withPaymentMadeActions';
import withPaymentMade from './withPaymentMade';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withSettings from '../../../Settings/withSettings';

import { usePaymentMadesTableColumns, ActionsMenu } from './components';
import { usePaymentMadesListContext } from './PaymentMadesListProvider';
import { useMemorizedColumnsWidths } from '@/hooks';

/**
 * Payment made datatable transactions.
 */
function PaymentMadesTable({
  // #withPaymentMadeActions
  setPaymentMadesTableState,

  // #withPaymentMade
  paymentMadesTableState,

  // #withAlerts
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withSettings
  paymentMadesTableSize,
}) {
  // Payment mades table columns.
  const columns = usePaymentMadesTableColumns();

  // Payment mades list context.
  const {
    paymentMades,
    pagination,
    isEmptyStatus,
    isPaymentsLoading,
    isPaymentsFetching,
  } = usePaymentMadesListContext();

  // History context.
  const history = useHistory();

  // Handles the edit payment made action.
  const handleEditPaymentMade = (paymentMade) => {
    history.push(`/payment-mades/${paymentMade.id}/edit`);
  };

  // Handles the delete payment made action.
  const handleDeletePaymentMade = (paymentMade) => {
    openAlert('payment-made-delete', { paymentMadeId: paymentMade.id });
  };

  // Handle view detail  payment made.
  const handleViewDetailPaymentMade = ({ id }) => {
    openDrawer('payment-made-detail-drawer', { paymentMadeId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('payment-made-detail-drawer', {
      paymentMadeId: cell.row.original.id,
    });
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PAYMENT_MADES);

  // Handle datatable fetch data once the table state change.
  const handleDataTableFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      setPaymentMadesTableState({ pageIndex, pageSize, sortBy });
    },
    [setPaymentMadesTableState],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <PaymentMadesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={paymentMades}
        onFetchData={handleDataTableFetchData}
        loading={isPaymentsLoading}
        headerLoading={isPaymentsLoading}
        progressBarLoading={isPaymentsFetching}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        pagesCount={pagination.pagesCount}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={paymentMadesTableSize}
        payload={{
          onEdit: handleEditPaymentMade,
          onDelete: handleDeletePaymentMade,
          onViewDetails: handleViewDetailPaymentMade,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withPaymentMadeActions,
  withPaymentMade(({ paymentMadesTableState }) => ({ paymentMadesTableState })),
  withAlertsActions,
  withDrawerActions,
  withCurrentOrganization(),
  withSettings(({ billPaymentSettings }) => ({
    paymentMadesTableSize: billPaymentSettings?.tableSize,
  })),
)(PaymentMadesTable);
