import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from 'utils';

import DataTable from 'components/DataTable';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import BillsEmptyStatus from './BillsEmptyStatus';

import withBills from './withBills';
import withBillActions from './withBillsActions';
import withSettings from 'containers/Settings/withSettings';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { useBillsTableColumns, ActionsMenu } from './components';
import { useBillsListContext } from './BillsListProvider';

/**
 * Bills transactions datatable.
 */
function BillsDataTable({
  // #withBillsActions
  setBillsTableState,

  // #withBills
  billsTableState,

  // #withAlerts
  openAlert,

  // #withDialogActions
  openDialog,
}) {
  // Bills list context.
  const { bills, pagination, isBillsLoading, isBillsFetching, isEmptyStatus } =
    useBillsListContext();

  const history = useHistory();

  // Bills table columns.
  const columns = useBillsTableColumns();

  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      setBillsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setBillsTableState],
  );

  // Handle bill edit action.
  const handleEditBill = (bill) => {
    history.push(`/bills/${bill.id}/edit`);
  };

  // Handle bill delete action.
  const handleDeleteBill = (bill) => {
    openAlert('bill-delete', { billId: bill.id });
  };

  // Handle bill open action.
  const handleOpenBill = (bill) => {
    openAlert('bill-open', { billId: bill.id });
  };

  // Handle quick payment made action.
  const handleQuickPaymentMade = ({ id }) => {
    openDialog('quick-payment-made', { billId: id });
  };

  // handle allocate landed cost.
  const handleAllocateLandedCost = ({ id }) => {
    openDialog('allocate-landed-cost', { billId: id });
  };

  if (isEmptyStatus) {
    return <BillsEmptyStatus />;
  }

  return (
    <DataTable
      columns={columns}
      data={bills}
      initialState={billsTableState}
      loading={isBillsLoading}
      headerLoading={isBillsLoading}
      progressBarLoading={isBillsFetching}
      onFetchData={handleFetchData}
      manualSortBy={true}
      selectionColumn={true}
      noInitialFetch={true}
      sticky={true}
      pagination={true}
      pagesCount={pagination.pagesCount}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      payload={{
        onDelete: handleDeleteBill,
        onEdit: handleEditBill,
        onOpen: handleOpenBill,
        onQuick: handleQuickPaymentMade,
        onAllocateLandedCost: handleAllocateLandedCost,
      }}
    />
  );
}

export default compose(
  withBills(({ billsTableState }) => ({ billsTableState })),
  withBillActions,
  withAlertsActions,
  withDialogActions,
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(BillsDataTable);
