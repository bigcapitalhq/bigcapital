import React, { useCallback } from 'react';
import classNames from 'classnames';

import { compose } from 'utils';

import { CLASSES } from 'common/classes';
import { DataTable } from 'components';
import PaymentMadesEmptyStatus from './PaymentMadesEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withPaymentMadeActions from './withPaymentMadeActions';
import withSettings from 'containers/Settings/withSettings';
import withAlertsActions from 'containers/Alert/withAlertActions';
import { usePaymentMadesTableColumns, ActionsMenu } from './components';
import { usePaymentMadesListContext } from './PaymentMadesListProvider';

/**
 * Payment made datatable transactions.
 */
function PaymentMadesTable({
  // #withPaymentMadeActions
  addPaymentMadesTableQueries,

  // #withAlerts
  openAlert,
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

  // Handles the edit payment made action.
  const handleEditPaymentMade = (paymentMade) => {};

  // Handles the delete payment made action.
  const handleDeletePaymentMade = (paymentMade) => {
    openAlert('payment-made-delete', { paymentMadeId: paymentMade.id });
  };

  // Handle datatable fetch data once the table state change.
  const handleDataTableFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addPaymentMadesTableQueries({ pageIndex, pageSize, sortBy });
    },
    [addPaymentMadesTableQueries],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <PaymentMadesEmptyStatus />;
  }

  return (
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
      payload={{
        onEdit: handleEditPaymentMade,
        onDelete: handleDeletePaymentMade,
      }}
    />
  );
}

export default compose(
  withPaymentMadeActions,
  withAlertsActions,
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(PaymentMadesTable);
