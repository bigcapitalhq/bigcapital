import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';
import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import ManualJournalsViewTabs from 'containers/Accounting/ManualJournalsViewTabs';
import ManualJournalsDataTable from 'containers/Accounting/ManualJournalsDataTable';
import ManualJournalsActionsBar from 'containers/Accounting/ManualJournalActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboard';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';
import withViewsActions from 'containers/Views/withViewsActions';

import { compose } from 'utils';

/**
 * Manual journals table.
 */
function ManualJournalsTable({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,

  // #withManualJournalsActions
  requestFetchManualJournalsTable,
  requestDeleteManualJournal,
  requestPublishManualJournal,
  requestDeleteBulkManualJournals,
  addManualJournalsTableQueries,
}) {
  const history = useHistory();

  const [deleteManualJournal, setDeleteManualJournal] = useState(false);
  const [deleteBulk, setDeleteBulk] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkDelete, setBulkDelete] = useState(false);

  const { formatMessage } = useIntl();

  const fetchViews = useQuery('journals-resource-views', () => {
    return requestFetchResourceViews('manual_journals');
  });

  const fetchManualJournals = useQuery('manual-journals-table',
    () => requestFetchManualJournalsTable());

  useEffect(() => {
    changePageTitle(formatMessage({id:'manual_journals'}));
  }, [changePageTitle]);

  // Handle delete manual journal click.
  const handleDeleteJournal = useCallback(
    (journal) => {
      setDeleteManualJournal(journal);
    },
    [setDeleteManualJournal]
  );

  // Handle cancel delete manual journal.
  const handleCancelManualJournalDelete = useCallback(() => {
    setDeleteManualJournal(false);
  }, [setDeleteManualJournal]);

  // Handle confirm delete manual journal.
  const handleConfirmManualJournalDelete = useCallback(() => {
    requestDeleteManualJournal(deleteManualJournal.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_journal_has_been_successfully_deleted',
        }, {
          number: deleteManualJournal.journal_number,
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteManualJournal(false);
    });
  }, [deleteManualJournal, requestDeleteManualJournal]);


  // Calculates the selected rows count.
  const selectedRowsCount = useMemo(
    () => Object.values(selectedRows).length,
    [selectedRows]);

  const handleBulkDelete = useCallback(
    (accountsIds) => {
      setBulkDelete(accountsIds);
    },
    [setBulkDelete]
  );

  // Handle confirm journals bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkManualJournals(bulkDelete)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_journals_has_been_successfully_deleted',
          }, {
            count: selectedRowsCount,
          }),
          intent: Intent.SUCCESS,
        });
        setBulkDelete(false);
      })
      .catch((error) => {
        setBulkDelete(false);
      });
  }, [requestDeleteBulkManualJournals, bulkDelete]);

  // Handle cancel bulk delete alert.
  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  const handleEditJournal = useCallback(
    (journal) => {
      history.push(`/manual-journals/${journal.id}/edit`);
    },
    [history]
  );

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {
    
  }, [fetchManualJournals]);

  // Handle view change to re-fetch data table.
  const handleViewChanged = useCallback(() => {
    
  }, [fetchManualJournals]);

  // Handle fetch data of manual jouranls datatable.
  const handleFetchData = useCallback(({ pageIndex, pageSize, sortBy }) => {
    addManualJournalsTableQueries({
      ...(sortBy.length > 0) ? {
        column_sort_by: sortBy[0].id,
        sort_order: sortBy[0].desc ? 'desc' : 'asc',
      } : {},
    });
  }, [addManualJournalsTableQueries]);

  const handlePublishJournal = useCallback(
    (journal) => {
      requestPublishManualJournal(journal.id).then(() => {
        AppToaster.show({
          message: 'the_manual_journal_id_has_been_published',
        });
      });
    },
    [requestPublishManualJournal]
  );

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (accounts) => {
      setSelectedRows(accounts);
    },
    [setSelectedRows]
  );

  return (
    <DashboardInsider
      loading={fetchViews.isFetching || fetchManualJournals.isFetching}
      name={'manual-journals'}
    >
      <ManualJournalsActionsBar
        onBulkDelete={handleBulkDelete}
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
      />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/manual-journals/:custom_view_id/custom_view',
              '/manual-journals',
            ]}> 
            <ManualJournalsViewTabs />

            <ManualJournalsDataTable
              onDeleteJournal={handleDeleteJournal}
              onFetchData={handleFetchData}
              onEditJournal={handleEditJournal}
              onPublishJournal={handlePublishJournal}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon='trash'
          intent={Intent.DANGER}
          isOpen={deleteManualJournal}
          onCancel={handleCancelManualJournalDelete}
          onConfirm={handleConfirmManualJournalDelete}
        >
          <p><T id={'once_delete_this_journal_category_you_will_able_to_restore_it'} /></p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete_count'} values={{ count: selectedRowsCount }} />}
          icon='trash'
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}
        >
          <p><T id={'once_delete_these_journalss_you_will_not_able_restore_them'} /></p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withManualJournalsActions,
  withViewsActions
)(ManualJournalsTable);
