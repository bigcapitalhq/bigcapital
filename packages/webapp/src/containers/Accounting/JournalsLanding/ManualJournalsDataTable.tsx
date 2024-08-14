// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { TABLES } from '@/constants/tables';

import ManualJournalsEmptyStatus from './ManualJournalsEmptyStatus';

import { ActionsMenu } from './components';

import withManualJournals from './withManualJournals';
import withManualJournalsActions from './withManualJournalsActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withSettings from '@/containers/Settings/withSettings';

import { useManualJournalsContext } from './ManualJournalsListProvider';
import { useMemorizedColumnsWidths } from '@/hooks';
import { useManualJournalsColumns } from './utils';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Manual journals data-table.
 */
function ManualJournalsDataTable({
  // #withManualJournalsActions
  setManualJournalsTableState,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withManualJournals
  manualJournalsTableState,

  // #ownProps
  onSelectedRowsChange,

  // #withSettings
  manualJournalsTableSize,
}) {
  // Manual journals context.
  const {
    manualJournals,
    pagination,
    isManualJournalsLoading,
    isManualJournalsFetching,
    isEmptyStatus,
  } = useManualJournalsContext();

  const history = useHistory();

  // Manual journals columns.
  const columns = useManualJournalsColumns();

  // Handles the journal publish action.
  const handlePublishJournal = ({ id }) => {
    openAlert('journal-publish', { manualJournalId: id });
  };

  // Handle the journal edit action.
  const handleEditJournal = ({ id }) => {
    history.push(`/manual-journals/${id}/edit`);
  };

  // Handle the journal delete action.
  const handleDeleteJournal = ({ id }) => {
    openAlert('journal-delete', { manualJournalId: id });
  };

  // Handle view detail journal.
  const handleViewDetailJournal = ({ id }) => {
    openDrawer(DRAWERS.JOURNAL_DETAILS, {
      manualJournalId: id,
    });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.JOURNAL_DETAILS, {
      manualJournalId: cell.row.original.id,
    });
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.MANUAL_JOURNALS);

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setManualJournalsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setManualJournalsTableState],
  );

  // Display manual journal empty status instead of the table.
  if (isEmptyStatus) {
    return <ManualJournalsEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={manualJournals}
        manualSortBy={true}
        selectionColumn={true}
        sticky={true}
        loading={isManualJournalsLoading}
        headerLoading={isManualJournalsLoading}
        progressBarLoading={isManualJournalsFetching}
        pagination={true}
        initialPageSize={manualJournalsTableState.pageSize}
        pagesCount={pagination.pagesCount}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onFetchData={handleFetchData}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={manualJournalsTableSize}
        payload={{
          onDelete: handleDeleteJournal,
          onPublish: handlePublishJournal,
          onEdit: handleEditJournal,
          onViewDetails: handleViewDetailJournal,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withManualJournalsActions,
  withManualJournals(({ manualJournalsTableState }) => ({
    manualJournalsTableState,
  })),
  withAlertsActions,
  withDrawerActions,
  withSettings(({ manualJournalsSettings }) => ({
    manualJournalsTableSize: manualJournalsSettings?.tableSize,
  })),
)(ManualJournalsDataTable);
