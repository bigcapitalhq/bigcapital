import * as FF from 'fp-ts/function';
import { useHistory } from 'react-router-dom';
import { useVendorsCreditNoteTableColumns, ActionsMenu } from './components';
import { VendorsCreditNoteEmptyStatus } from './VendorsCreditNoteEmptyStatus';
import { useVendorsCreditNoteListContext } from './VendorsCreditNoteListProvider';
import { withVendorsCreditNotes } from './withVendorsCreditNotes';
import { withVendorsCreditNotesActions } from './withVendorsCreditNotesActions';
import type { VendorCreditTableRow } from './components';
import type { WithVendorsCreditNotesProps } from './withVendorsCreditNotes';
import type { WithVendorsCreditNotesActionsProps } from './withVendorsCreditNotesActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { isSmallTableSize, TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.VENDOR_CREDITS,
  rowName: 'vendor-credit',
  identifierColumn: 'credit_number',
  ActionsMenu,
});

interface VendorsCreditNoteDataTableProps
  extends Pick<
      WithVendorsCreditNotesProps,
      'vendorsCreditNoteTableState' | 'vendorsCreditNoteSelectedRows'
    >,
    WithVendorsCreditNotesActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    WithDialogActionsProps {}

function VendorsCreditNoteDataTableInner({
  setVendorsCreditNoteTableState,
  setVendorsCreditNoteSelectedRows,
  vendorsCreditNoteTableState,
  vendorsCreditNoteSelectedRows,
  openAlert,
  openDrawer,
  openDialog,
}: VendorsCreditNoteDataTableProps) {
  const history = useHistory();

  const {
    vendorCredits,
    pagination,
    isEmptyStatus,
    isVendorCreditsFetching,
    isVendorCreditsLoading,
    vendorCreditSettings,
  } = useVendorsCreditNoteListContext();

  const columns = useVendorsCreditNoteTableColumns();

  if (isEmptyStatus) {
    return <VendorsCreditNoteEmptyStatus />;
  }

  const handleViewDetailVendorCredit = ({ id }: VendorCreditTableRow) => {
    openDrawer(DRAWERS.VENDOR_CREDIT_DETAILS, { vendorCreditId: id });
  };

  const handleDeleteVendorCreditNote = ({ id }: VendorCreditTableRow) => {
    openAlert('vendor-credit-delete', { vendorCreditId: id });
  };

  const hanldeEditVendorCreditNote = (vendorCredit: VendorCreditTableRow) => {
    history.push(`/vendor-credits/${vendorCredit.id}/edit`);
  };

  const handleRefundCreditVendor = ({ id }: VendorCreditTableRow) => {
    openDialog('refund-vendor-credit', { vendorCreditId: id });
  };

  const handleOpenCreditNote = ({ id }: VendorCreditTableRow) => {
    openAlert('vendor-credit-open', { vendorCreditId: id });
  };

  const handleReconcileVendorCredit = ({ id }: VendorCreditTableRow) => {
    openDialog('reconcile-vendor-credit', { vendorCreditId: id });
  };

  return (
    <Table
      columns={columns}
      data={vendorCredits}
      total={pagination?.total}
      loading={isVendorCreditsLoading}
      fetching={isVendorCreditsFetching}
      compact={isSmallTableSize(vendorCreditSettings?.tableSize)}
      query={vendorsCreditNoteTableState}
      setQuery={setVendorsCreditNoteTableState}
      selectedIds={vendorsCreditNoteSelectedRows}
      setSelectedIds={setVendorsCreditNoteSelectedRows}
      actions={{
        onViewDetails: handleViewDetailVendorCredit,
        onDelete: handleDeleteVendorCreditNote,
        onEdit: hanldeEditVendorCreditNote,
        onRefund: handleRefundCreditVendor,
        onOpen: handleOpenCreditNote,
        onReconcile: handleReconcileVendorCredit,
      }}
    />
  );
}

export const VendorsCreditNoteDataTable = FF.pipe(
  VendorsCreditNoteDataTableInner,
  withVendorsCreditNotes(
    ({ vendorsCreditNoteTableState, vendorsCreditNoteSelectedRows }) => ({
      vendorsCreditNoteTableState,
      vendorsCreditNoteSelectedRows,
    }),
  ),
  withDialogActions,
  withDrawerActions,
  withAlertActions,
  withVendorsCreditNotesActions,
  withDashboardActions,
);
