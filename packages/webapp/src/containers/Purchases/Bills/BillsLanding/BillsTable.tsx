import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { BillsEmptyStatus } from './BillsEmptyStatus';
import { useBillsListContext } from './BillsListProvider';
import { useBillsTableColumns, ActionsMenu } from './components';
import { withBills } from './withBills';
import { withBillsActions } from './withBillsActions';
import type { BillTableRow } from './components';
import type { WithBillsProps } from './withBills';
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

interface WithBillsActionsProps {
  setBillsTableState: (state: Record<string, any>) => void;
  setBillsSelectedRows: (ids: number[]) => void;
}

interface BillsDataTableProps
  extends Pick<WithBillsProps, 'billsTableState'>,
    WithBillsActionsProps,
    WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {}

function BillsDataTable({
  setBillsTableState,
  setBillsSelectedRows,
  billsTableState,
  openAlert,
  openDialog,
  openDrawer,
}: BillsDataTableProps) {
  const {
    bills,
    pagination,
    isBillsLoading,
    isBillsFetching,
    isEmptyStatus,
    billSettings,
  } = useBillsListContext();
  const billsTableSize = billSettings?.tableSize as string | undefined;

  const history = useHistory();
  const columns = useBillsTableColumns();

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
      setBillsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setBillsTableState],
  );

  const handleEditBill = (bill: BillTableRow) => {
    history.push(`/bills/${bill.id}/edit`);
  };

  const handleConvertToVendorCredit = ({ id }: BillTableRow) => {
    history.push(`/vendor-credits/new?from_bill_id=${id}`, { billId: id });
  };

  const handleDeleteBill = (bill: BillTableRow) => {
    openAlert('bill-delete', { billId: bill.id });
  };

  const handleOpenBill = (bill: BillTableRow) => {
    openAlert('bill-open', { billId: bill.id });
  };

  const handleQuickPaymentMade = ({ id }: BillTableRow) => {
    openDialog('quick-payment-made', { billId: id });
  };

  const handleAllocateLandedCost = ({ id }: BillTableRow) => {
    openDialog('allocate-landed-cost', { billId: id });
  };

  const handleViewDetailBill = ({ id }: BillTableRow) => {
    openDrawer(DRAWERS.BILL_DETAILS, { billId: id });
  };

  const handleCellClick = (cell: any, _event: React.MouseEvent) => {
    openDrawer(DRAWERS.BILL_DETAILS, { billId: cell.row.original.id });
  };

  const handleSelectedRowsChange = useCallback(
    (selectedFlatRows: Array<{ original: BillTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setBillsSelectedRows(selectedIds);
    },
    [setBillsSelectedRows],
  );

  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.BILLS);

  if (isEmptyStatus) {
    return <BillsEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={bills ?? []}
        loading={isBillsLoading}
        headerLoading={isBillsLoading}
        progressBarLoading={isBillsFetching}
        onFetchData={handleFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        initialPageSize={billsTableState?.pageSize ?? 10}
        rowsCount={pagination?.total ?? 0}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        onSelectedRowsChange={handleSelectedRowsChange}
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

export const BillsTable = compose(
  withBills(({ billsTableState }) => ({ billsTableState })),
  withBillsActions,
  withAlertActions,
  withDrawerActions,
  withDialogActions,
)(BillsDataTable);
