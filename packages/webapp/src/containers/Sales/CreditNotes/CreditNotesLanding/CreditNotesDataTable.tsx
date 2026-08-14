import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCreditNoteTableColumns, ActionsMenu } from './components';
import { CreditNotesEmptyStatus as CreditNoteEmptyStatus } from './CreditNotesEmptyStatus';
import { useCreditNoteListContext } from './CreditNotesListProvider';
import { withCreditNotes } from './withCreditNotes';
import { withCreditNotesActions } from './withCreditNotesActions';
import type { CreditNoteTableRow } from './components';
import type { WithCreditNotesProps } from './withCreditNotes';
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

interface WithCreditNotesActionsProps {
  setCreditNotesTableState: (state: Record<string, any>) => void;
  setCreditNotesSelectedRows: (ids: number[]) => void;
}

interface CreditNotesDataTableProps
  extends Pick<
      WithCreditNotesProps,
      'creditNoteTableState' | 'creditNotesSelectedRows'
    >,
    WithCreditNotesActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    WithDialogActionsProps {}

function CreditNotesDataTableInner({
  setCreditNotesTableState,
  setCreditNotesSelectedRows,
  openAlert,
  openDrawer,
  openDialog,
  creditNoteTableState,
  creditNotesSelectedRows,
}: CreditNotesDataTableProps) {
  const history = useHistory();

  const {
    creditNotes,
    pagination,
    isEmptyStatus,
    isCreditNotesFetching,
    isCreditNotesLoading,
    creditNoteSettings,
  } = useCreditNoteListContext();
  const creditNoteTableSize = creditNoteSettings?.tableSize as
    | string
    | undefined;

  const columns = useCreditNoteTableColumns();

  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.CREDIT_NOTES);

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
      setCreditNotesTableState({
        pageSize,
        pageIndex,
        sortBy,
      });
    },
    [setCreditNotesTableState],
  );

  const handleSelectedRowsChange = React.useCallback(
    (selectedFlatRows: Array<{ original: CreditNoteTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setCreditNotesSelectedRows(selectedIds);
    },
    [setCreditNotesSelectedRows],
  );

  if (isEmptyStatus) {
    return <CreditNoteEmptyStatus />;
  }

  const handleViewDetailCreditNote = ({ id }: CreditNoteTableRow) => {
    openDrawer(DRAWERS.CREDIT_NOTE_DETAILS, { creditNoteId: id });
  };

  const handleDeleteCreditNote = ({ id }: CreditNoteTableRow) => {
    openAlert('credit-note-delete', { creditNoteId: id });
  };

  const hanldeEditCreditNote = (creditNote: CreditNoteTableRow) => {
    history.push(`/credit-notes/${creditNote.id}/edit`);
  };

  const handleCellClick = (cell: any, _event: React.MouseEvent) => {
    openDrawer(DRAWERS.CREDIT_NOTE_DETAILS, {
      creditNoteId: cell.row.original.id,
    });
  };

  const handleRefundCreditNote = ({ id }: CreditNoteTableRow) => {
    openDialog('refund-credit-note', { creditNoteId: id });
  };

  const handleOpenCreditNote = ({ id }: CreditNoteTableRow) => {
    openAlert('credit-note-open', { creditNoteId: id });
  };

  const handleReconcileCreditNote = ({ id }: CreditNoteTableRow) => {
    openDialog('reconcile-credit-note', { creditNoteId: id });
  };

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={creditNotes ?? []}
        loading={isCreditNotesLoading}
        headerLoading={isCreditNotesLoading}
        progressBarLoading={isCreditNotesFetching}
        onFetchData={handleDataTableFetchData}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={creditNotesSelectedRows}
        autoResetSelectedRows={false}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        initialPageSize={creditNoteTableState?.pageSize ?? 10}
        rowsCount={pagination?.total ?? 0}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={creditNoteTableSize}
        payload={{
          onViewDetails: handleViewDetailCreditNote,
          onDelete: handleDeleteCreditNote,
          onEdit: hanldeEditCreditNote,
          onRefund: handleRefundCreditNote,
          onOpen: handleOpenCreditNote,
          onReconcile: handleReconcileCreditNote,
        }}
      />
    </DashboardContentTable>
  );
}

export const CreditNotesDataTable = compose(
  withDashboardActions,
  withCreditNotesActions,
  withDrawerActions,
  withAlertActions,
  withDialogActions,
  withCreditNotes(({ creditNoteTableState, creditNotesSelectedRows }) => ({
    creditNoteTableState,
    creditNotesSelectedRows,
  })),
)(CreditNotesDataTableInner);
