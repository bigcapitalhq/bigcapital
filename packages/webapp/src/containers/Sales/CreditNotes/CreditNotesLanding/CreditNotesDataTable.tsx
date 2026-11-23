import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCreditNoteTableColumns, ActionsMenu } from './components';
import { CreditNotesEmptyStatus as CreditNoteEmptyStatus } from './CreditNotesEmptyStatus';
import { useCreditNoteListContext } from './CreditNotesListProvider';
import { withCreditNotes } from './withCreditNotes';
import { withCreditNotesActions } from './withCreditNotesActions';
import type { CreditNoteTableRow } from './components';
import type { WithCreditNotesProps } from './withCreditNotes';
import type { WithCreditNotesActionsProps } from './withCreditNotesActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { createSalesListTable } from '@/containers/Sales/SalesListTable';

const Table = createSalesListTable({
  tableName: TABLES.CREDIT_NOTES,
  rowName: 'credit-note',
  identifierColumn: 'credit_number',
  ActionsMenu,
});

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

  const columns = useCreditNoteTableColumns();

  const handleViewDetailCreditNote = ({ id }: CreditNoteTableRow) => {
    openDrawer(DRAWERS.CREDIT_NOTE_DETAILS, { creditNoteId: id });
  };

  const handleDeleteCreditNote = ({ id }: CreditNoteTableRow) => {
    openAlert('credit-note-delete', { creditNoteId: id });
  };

  const handleEditCreditNote = (creditNote: CreditNoteTableRow) => {
    history.push(`/credit-notes/${creditNote.id}/edit`);
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

  const handleSendMailCreditNote = ({ id }: CreditNoteTableRow) => {
    openDrawer(DRAWERS.CREDIT_NOTE_SEND_MAIL, { creditNoteId: id });
  };

  if (isEmptyStatus) {
    return <CreditNoteEmptyStatus />;
  }

  const actions = {
    onViewDetails: handleViewDetailCreditNote,
    onDelete: handleDeleteCreditNote,
    onEdit: handleEditCreditNote,
    onRefund: handleRefundCreditNote,
    onOpen: handleOpenCreditNote,
    onReconcile: handleReconcileCreditNote,
    onSendMail: handleSendMailCreditNote,
  };

  return (
    <Table
      columns={columns}
      data={creditNotes}
      total={pagination?.total}
      loading={isCreditNotesLoading}
      fetching={isCreditNotesFetching}
      compact={creditNoteSettings?.tableSize === 'small'}
      query={creditNoteTableState}
      setQuery={setCreditNotesTableState}
      selectedIds={creditNotesSelectedRows}
      setSelectedIds={setCreditNotesSelectedRows}
      actions={actions}
    />
  );
}

export const CreditNotesDataTable = FF.pipe(
  CreditNotesDataTableInner,
  withCreditNotes(({ creditNoteTableState, creditNotesSelectedRows }) => ({
    creditNoteTableState,
    creditNotesSelectedRows,
  })),
  withDialogActions,
  withAlertActions,
  withDrawerActions,
  withCreditNotesActions,
  withDashboardActions,
);
