import React from 'react';
import { useHistory } from 'react-router-dom';
import { useVendorsCreditNoteTableColumns, ActionsMenu } from './components';
import { VendorsCreditNoteEmptyStatus } from './VendorsCreditNoteEmptyStatus';
import { useVendorsCreditNoteListContext } from './VendorsCreditNoteListProvider';
import { withVendorsCreditNotes } from './withVendorsCreditNotes';
import { withVendorsCreditNotesActions } from './withVendorsCreditNotesActions';
import type { VendorCreditTableRow } from './components';
import type { WithVendorsCreditNotesProps } from './withVendorsCreditNotes';
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
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface WithVendorsCreditNotesActionsProps {
  setVendorsCreditNoteTableState: (state: Record<string, any>) => void;
  setVendorsCreditNoteSelectedRows: (ids: number[]) => void;
}

interface VendorsCreditNoteDataTableProps
  extends Pick<WithVendorsCreditNotesProps, 'vendorsCreditNoteTableState'>,
    WithVendorsCreditNotesActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    WithDialogActionsProps {}

function VendorsCreditNoteDataTableInner({
  setVendorsCreditNoteTableState,
  setVendorsCreditNoteSelectedRows,
  vendorsCreditNoteTableState,
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
  const creditNoteTableSize = vendorCreditSettings?.tableSize as
    | string
    | undefined;

  const columns = useVendorsCreditNoteTableColumns();

  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.VENDOR_CREDITS);

  const handleDataTableFetchData = React.useCallback(
    ({
      pageSize,
      pageIndex,
      sortBy,
    }: {
      pageSize: number;
      pageIndex: number;
      sortBy: Array<{ id: string; desc: boolean }>;
    }) => {
      setVendorsCreditNoteTableState({
        pageSize,
        pageIndex,
        sortBy,
      });
    },
    [setVendorsCreditNoteTableState],
  );

  const handleSelectedRowsChange = React.useCallback(
    (selectedFlatRows: Array<{ original: VendorCreditTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setVendorsCreditNoteSelectedRows(selectedIds);
    },
    [setVendorsCreditNoteSelectedRows],
  );

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

  const handleCellClick = (cell: any, _event: React.MouseEvent) => {
    openDrawer(DRAWERS.VENDOR_CREDIT_DETAILS, {
      vendorCreditId: cell.row.original.id,
    });
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
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={vendorCredits ?? []}
        loading={isVendorCreditsLoading}
        headerLoading={isVendorCreditsLoading}
        progressBarLoading={isVendorCreditsFetching}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        initialPageSize={vendorsCreditNoteTableState?.pageSize ?? 10}
        rowsCount={pagination?.total ?? 0}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        onSelectedRowsChange={handleSelectedRowsChange}
        size={creditNoteTableSize}
        payload={{
          onViewDetails: handleViewDetailVendorCredit,
          onDelete: handleDeleteVendorCreditNote,
          onEdit: hanldeEditVendorCreditNote,
          onRefund: handleRefundCreditVendor,
          onOpen: handleOpenCreditNote,
          onReconcile: handleReconcileVendorCredit,
        }}
      />
    </DashboardContentTable>
  );
}

export const VendorsCreditNoteDataTable = compose(
  withDashboardActions,
  withVendorsCreditNotesActions,
  withAlertActions,
  withDrawerActions,
  withDialogActions,
  withVendorsCreditNotes(({ vendorsCreditNoteTableState }) => ({
    vendorsCreditNoteTableState,
  })),
)(VendorsCreditNoteDataTableInner);
