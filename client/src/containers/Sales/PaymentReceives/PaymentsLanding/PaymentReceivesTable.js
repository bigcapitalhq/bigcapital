import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from 'utils';

import PaymentReceivesEmptyStatus from './PaymentReceivesEmptyStatus';
import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withSettings from 'containers/Settings/withSettings';
import { usePaymentReceivesColumns, ActionsMenu } from './components';
import { usePaymentReceivesListContext } from './PaymentReceiptsListProvider';

/**
 * Payment receives datatable.
 */
function PaymentReceivesDataTable({
  // #withPaymentReceivesActions
  setPaymentReceivesTableState,

  // #withAlertsActions
  openAlert,
}) {
  const history = useHistory();

  // Payment receives list context.
  const {
    paymentReceives,
    pagination,

    isPaymentReceivesLoading,
    isPaymentReceivesFetching,
    isEmptyStatus,
  } = usePaymentReceivesListContext();

  // Payment receives columns.
  const columns = usePaymentReceivesColumns();

  // Handles edit payment receive.
  const handleEditPaymentReceive = ({ id }) => {
    history.push(`/payment-receives/${id}/edit`);
  };

  // Handles delete payment receive.
  const handleDeletePaymentReceive = ({ id }) => {
    openAlert('payment-receive-delete', { paymentReceiveId: id });
  };

  // Handle datatable fetch once the table's state changing.
  const handleDataTableFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      setPaymentReceivesTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setPaymentReceivesTableState],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <PaymentReceivesEmptyStatus />;
  }

  return (
    <DataTable
      columns={columns}
      data={paymentReceives}
      loading={isPaymentReceivesLoading}
      headerLoading={isPaymentReceivesLoading}
      progressBarLoading={isPaymentReceivesFetching}
      onFetchData={handleDataTableFetchData}
      manualSortBy={true}
      selectionColumn={true}
      noInitialFetch={true}
      sticky={true}
      autoResetSortBy={false}
      autoResetPage={false}
      pagination={true}
      pagesCount={pagination.pagesCount}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      payload={{
        onDelete: handleDeletePaymentReceive,
        onEdit: handleEditPaymentReceive,
      }}
    />
  );
}

export default compose(
  withPaymentReceivesActions,
  withAlertsActions,
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(PaymentReceivesDataTable);
