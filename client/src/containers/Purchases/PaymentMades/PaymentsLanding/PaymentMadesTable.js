import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from 'utils';

import { DataTable, DashboardContentTable } from 'components';

import PaymentMadesEmptyStatus from './PaymentMadesEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withPaymentMadeActions from './withPaymentMadeActions';
import withPaymentMade from './withPaymentMade';
import withSettings from 'containers/Settings/withSettings';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import { usePaymentMadesTableColumns, ActionsMenu } from './components';
import { usePaymentMadesListContext } from './PaymentMadesListProvider';

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
        initialState={paymentMadesTableState}
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
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(PaymentMadesTable);
