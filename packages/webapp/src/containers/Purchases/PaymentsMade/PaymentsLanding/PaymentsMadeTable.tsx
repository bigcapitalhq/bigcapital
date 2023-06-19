// @ts-nocheck
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from '@/utils';
import { TABLES } from '@/constants/tables';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';

import PaymentsMadeEmptyStatus from './PaymentsMadeEmptyStatus';

import withPaymentMade from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withSettings from '@/containers/Settings/withSettings';

import { usePaymentsMadeTableColumns, ActionsMenu } from './components';
import { usePaymentsMadeListContext } from './PaymentsMadeListProvider';
import { useMemorizedColumnsWidths } from '@/hooks';
import { DRAWERS } from '@/constants/drawers';

/**
 * Payment made datatable transactions.
 */
function PaymentsMadeTable({
  // #withPaymentMadeActions
  setPaymentsMadeTableState,

  // #withPaymentMade
  paymentsMadeTableState,

  // #withAlerts
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withSettings
  paymentsMadeTableSize,
}) {
  // Payments made table columns.
  const columns = usePaymentsMadeTableColumns();

  // Payments made list context.
  const {
    paymentsMade,
    pagination,
    isEmptyStatus,
    isPaymentsLoading,
    isPaymentsFetching,
  } = usePaymentsMadeListContext();

  // History context.
  const history = useHistory();

  // Handles the edit payment made action.
  const handleEditPaymentMade = (paymentMade) => {
    history.push(`/payments-made/${paymentMade.id}/edit`);
  };

  // Handles the delete payment made action.
  const handleDeletePaymentMade = (paymentMade) => {
    openAlert('payment-made-delete', { paymentMadeId: paymentMade.id });
  };

  // Handle view detail  payment made.
  const handleViewDetailPaymentMade = ({ id }) => {
    openDrawer(DRAWERS.PAYMENT_MADE_DETAILS, { paymentMadeId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.PAYMENT_MADE_DETAILS, {
      paymentMadeId: cell.row.original.id,
    });
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PAYMENTS_MADE);

  // Handle datatable fetch data once the table state change.
  const handleDataTableFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      setPaymentsMadeTableState({ pageIndex, pageSize, sortBy });
    },
    [setPaymentsMadeTableState],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <PaymentsMadeEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={paymentsMade}
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
        size={paymentsMadeTableSize}
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
  withPaymentMade(({ paymentsMadeTableState }) => ({ paymentsMadeTableState })),
  withAlertsActions,
  withDrawerActions,
  withCurrentOrganization(),
  withSettings(({ billPaymentSettings }) => ({
    paymentsMadeTableSize: billPaymentSettings?.tableSize,
  })),
)(PaymentsMadeTable);
