// @ts-nocheck
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { TABLES } from '@/constants/tables';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';

import BillsEmptyStatus from './BillsEmptyStatus';

import withBills from './withBills';
import withBillActions from './withBillsActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withSettings from '@/containers/Settings/withSettings';

import { useBillsTableColumns, ActionsMenu } from './components';
import { useBillsListContext } from './BillsListProvider';
import { useMemorizedColumnsWidths } from '@/hooks';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

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

  // #withDrawerActions
  openDrawer,

  // #withSettings
  billsTableSize,
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

  // Handle convert to vendor credit.
  const handleConvertToVendorCredit = ({ id }) => {
    history.push(`/vendor-credits/new?from_bill_id=${id}`, { billId: id });
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

  // Handle view detail bill.
  const handleViewDetailBill = ({ id }) => {
    openDrawer(DRAWERS.BILL_DETAILS, { billId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.BILL_DETAILS, { billId: cell.row.original.id });
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.BILLS);

  if (isEmptyStatus) {
    return <BillsEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={bills}
        loading={isBillsLoading}
        headerLoading={isBillsLoading}
        progressBarLoading={isBillsFetching}
        onFetchData={handleFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        initialPageSize={billsTableState.pageSize}
        pagesCount={pagination.pagesCount}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={billsTableSize}
        payload={{
          onDelete: handleDeleteBill,
          onEdit: handleEditBill,
          onOpen: handleOpenBill,
          onQuick: handleQuickPaymentMade,
          onAllocateLandedCost: handleAllocateLandedCost,
          onViewDetails: handleViewDetailBill,
          onConvert: handleConvertToVendorCredit,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withBills(({ billsTableState }) => ({ billsTableState })),
  withBillActions,
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
  withSettings(({ billsettings }) => ({
    billsTableSize: billsettings?.tableSize,
  })),
)(BillsDataTable);
