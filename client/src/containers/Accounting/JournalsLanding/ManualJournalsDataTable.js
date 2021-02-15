import React from 'react';
import { useHistory } from 'react-router-dom';

import { DataTable } from 'components';

import ManualJournalsEmptyStatus from './ManualJournalsEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withManualJournalsActions from './withManualJournalsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { useManualJournalsContext } from './ManualJournalsListProvider';
import { useManualJournalsColumns } from './utils';
import { ActionsMenu } from './components';

import { compose } from 'utils';

/**
 * Manual journals data-table.
 */
function ManualJournalsDataTable({
  // #withManualJournalsActions
  setManualJournalsTableState,

  // #withAlertsActions
  openAlert,

  // #ownProps
  onSelectedRowsChange,
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
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={manualJournals}
      manualSortBy={true}
      selectionColumn={true}
      expandable={true}
      sticky={true}
      loading={isManualJournalsLoading}
      headerLoading={isManualJournalsLoading}
      progressBarLoading={isManualJournalsFetching}
      pagesCount={pagination.pagesCount}
      pagination={true}
      autoResetSortBy={false}
      autoResetPage={false}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      onFetchData={handleFetchData}
      payload={{
        onDelete: handleDeleteJournal,
        onPublish: handlePublishJournal,
        onEdit: handleEditJournal,
      }}
    />
  );
}

export default compose(
  withManualJournalsActions,
  withAlertsActions,
)(ManualJournalsDataTable);
