import * as FF from 'fp-ts/function';
import { useHistory } from 'react-router-dom';
import { BillsEmptyStatus } from './BillsEmptyStatus';
import { useBillsListContext } from './BillsListProvider';
import { useBillsTableColumns, ActionsMenu } from './components';
import { withBills } from './withBills';
import { withBillsActions } from './withBillsActions';
import type { BillTableRow } from './components';
import type { WithBillsProps } from './withBills';
import type { WithBillsActionsProps } from './withBillsActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.BILLS,
  rowName: 'bill',
  identifierColumn: 'bill_number',
  ActionsMenu,
});

interface BillsDataTableProps
  extends Pick<WithBillsProps, 'billsTableState' | 'billsSelectedRows'>,
    WithBillsActionsProps,
    WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {}

function BillsDataTable({
  setBillsTableState,
  setBillsSelectedRows,
  billsTableState,
  billsSelectedRows,
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

  const history = useHistory();
  const columns = useBillsTableColumns();

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

  if (isEmptyStatus) {
    return <BillsEmptyStatus />;
  }

  return (
    <Table
      columns={columns}
      data={bills}
      total={pagination?.total}
      loading={isBillsLoading}
      fetching={isBillsFetching}
      compact={billSettings?.tableSize === 'small'}
      query={billsTableState}
      setQuery={setBillsTableState}
      selectedIds={billsSelectedRows}
      setSelectedIds={setBillsSelectedRows}
      actions={{
        onDelete: handleDeleteBill,
        onEdit: handleEditBill,
        onOpen: handleOpenBill,
        onQuick: handleQuickPaymentMade,
        onAllocateLandedCost: handleAllocateLandedCost,
        onViewDetails: handleViewDetailBill,
        onConvert: handleConvertToVendorCredit,
      }}
    />
  );
}

export const BillsTable = FF.pipe(
  BillsDataTable,
  withDialogActions,
  withDrawerActions,
  withAlertActions,
  withBillsActions,
  withBills(({ billsTableState, billsSelectedRows }) => ({
    billsTableState,
    billsSelectedRows,
  })),
);
