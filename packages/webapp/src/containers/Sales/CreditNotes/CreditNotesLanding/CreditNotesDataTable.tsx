// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import { TABLES } from '@/constants/tables';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { useMemorizedColumnsWidths } from '@/hooks';

import CreditNoteEmptyStatus from './CreditNotesEmptyStatus';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withCreditNotesActions from './withCreditNotesActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';

import { useCreditNoteTableColumns, ActionsMenu } from './components';
import { useCreditNoteListContext } from './CreditNotesListProvider';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Credit note data table.
 */
function CreditNotesDataTable({
  // #withCreditNotesActions
  setCreditNotesTableState,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,

  // #withSettings
  creditNoteTableSize,
}) {
  const history = useHistory();

  // Credit note list context.
  const {
    creditNotes,
    pagination,
    isEmptyStatus,
    isCreditNotesFetching,
    isCreditNotesLoading,
  } = useCreditNoteListContext();

  // Credit note table columns.
  const columns = useCreditNoteTableColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.CREDIT_NOTES);

  // Handles fetch data once the table state change.
  const handleDataTableFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setCreditNotesTableState({
        pageSize,
        pageIndex,
        sortBy,
      });
    },
    [setCreditNotesTableState],
  );

  // Display create note empty status instead of the table.
  if (isEmptyStatus) {
    return <CreditNoteEmptyStatus />;
  }

  const handleViewDetailCreditNote = ({ id }) => {
    openDrawer(DRAWERS.CREDIT_NOTE_DETAILS, { creditNoteId: id });
  };

  // Handle delete credit note.
  const handleDeleteCreditNote = ({ id }) => {
    openAlert('credit-note-delete', { creditNoteId: id });
  };

  // Handle edit credit note.
  const handleEditCreditNote = (creditNote) => {
    history.push(`/credit-notes/${creditNote.id}/edit`);
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.CREDIT_NOTE_DETAILS, {
      creditNoteId: cell.row.original.id,
    });
  };

  const handleRefundCreditNote = ({ id }) => {
    openDialog('refund-credit-note', { creditNoteId: id });
  };

  // Handle cancel/confirm credit note open.
  const handleOpenCreditNote = ({ id }) => {
    openAlert('credit-note-open', { creditNoteId: id });
  };

  // Handle reconcile credit note.
  const handleReconcileCreditNote = ({ id }) => {
    openDialog('reconcile-credit-note', { creditNoteId: id });
  };

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={creditNotes}
        loading={isCreditNotesLoading}
        headerLoading={isCreditNotesLoading}
        progressBarLoading={isCreditNotesFetching}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        pagesCount={pagination.pagesCount}
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
          onEdit: handleEditCreditNote,
          onRefund: handleRefundCreditNote,
          onOpen: handleOpenCreditNote,
          onReconcile: handleReconcileCreditNote,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withDashboardActions,
  withCreditNotesActions,
  withDrawerActions,
  withAlertsActions,
  withDialogActions,
  withSettings(({ creditNoteSettings }) => ({
    creditNoteTableSize: creditNoteSettings?.tableSize,
  })),
)(CreditNotesDataTable);
