import React from 'react';
import classNames from 'classnames';
import { DataTable, Choose } from 'components';
import { CLASSES } from 'common/classes';

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
    isEmptyStatus
  } = useManualJournalsContext();

  // Manual journals columns.
  const columns = useManualJournalsColumns();

  // Handles the journal publish action.
  const handlePublishJournal = ({ id }) => {
    openAlert('journal-publish', { manualJournalId: id })
  };

  // Handle the journal edit action.
  const handleEditJournal = ({ id }) => {

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

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <Choose>
        <Choose.When condition={isEmptyStatus}>
          <ManualJournalsEmptyStatus />
        </Choose.When>

        <Choose.Otherwise>
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
              onPublish: handlePublishJournal
            }}
          />
        </Choose.Otherwise>
      </Choose>
    </div>
  );
}

export default compose(
  withManualJournalsActions,
  withAlertsActions
)(ManualJournalsDataTable);
