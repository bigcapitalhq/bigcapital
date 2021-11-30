import React from 'react';
import { useHistory } from 'react-router-dom';

import CreditNoteEmptyStatus from './CreditNotesEmptyStatus';
import { DataTable, DashboardContentTable } from 'components';
import { TABLES } from 'common/tables';
import { useMemorizedColumnsWidths } from 'hooks';

import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCreditNotesActions from './withCreditNotesActions';
import withSettings from '../../../Settings/withSettings';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { useCreditNoteTableColumns, ActionsMenu } from './components';
import { useCreditNoteListContext } from './CreditNotesListProvider';

import { compose } from 'utils';

/**
 * Credit note data table.
 */
function CreditNotesDataTable({
  // #withCreditNotesActions
  setCreditNotesTableState,

  // #withAlertsActions
  openAlert,

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

  // Handle delete credit note.
  const handleDeleteCreditNote = ({ id }) => {
    openAlert('credit-note-delete', { creditNoteId: id });
  };

  // Handle edit credit note.
  const hanldeEditCreditNote = (creditNote) => {
    history.push(`/credit-notes/${creditNote.id}/edit`);
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
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        pagesCount={pagination.pagesCount}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={creditNoteTableSize}
        payload={{
          onDelete: handleDeleteCreditNote,
          onEdit: hanldeEditCreditNote,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withDashboardActions,
  withCreditNotesActions,
  withAlertsActions,
  withSettings(({ creditNoteSettings }) => ({
    creditNoteTableSize: creditNoteSettings?.tableSize,
  })),
)(CreditNotesDataTable);
