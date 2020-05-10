import React, { useEffect, useState, useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';
import AppToaster from 'components/AppToaster';

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkDelete, setBulkDelete] = useState(false);

  const fetchViews = useQuery('journals-resource-views', () => {
    return requestFetchResourceViews('manual_journals');
  });

  const fetchManualJournals = useQuery('manual-journals-table', () => 
    requestFetchManualJournalsTable());

  useEffect(() => {
    changePageTitle('Manual Journals');
  }, [changePageTitle]);

  // Handle delete manual journal click.
  const handleDeleteJournal = useCallback((journal) => {
    setDeleteManualJournal(journal);
  }, [setDeleteManualJournal]);

  // Handle cancel delete manual journal.
  const handleCancelManualJournalDelete = useCallback(() => {
    setDeleteManualJournal(false);
  }, [setDeleteManualJournal]);

  // Handle confirm delete manual journal.
  const handleConfirmManualJournalDelete = useCallback(() => {
    requestDeleteManualJournal(deleteManualJournal.id).then(() => {
      setDeleteManualJournal(false);
      AppToaster.show({ message: 'the_manual_Journal_has_been_deleted' });
    });
  }, [deleteManualJournal, requestDeleteManualJournal]);

  const handleBulkDelete = useCallback((accountsIds) => {
    setBulkDelete(accountsIds);
  }, [setBulkDelete]);

  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkManualJournals(bulkDelete).then(() => {
      setBulkDelete(false);
      AppToaster.show({ message: 'the_accounts_have_been_deleted' });
    }).catch((error) => {
      setBulkDelete(false);
    });
  }, [
    requestDeleteBulkManualJournals,
    bulkDelete,
  ]);

  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  const handleEditJournal = useCallback((journal) => {
    history.push(`/dashboard/accounting/manual-journals/${journal.id}/edit`);
  }, [history]);
  
  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {
    fetchManualJournals.refetch();
  }, [fetchManualJournals]);

  // Handle view change to re-fetch data table.
  const handleViewChanged = useCallback(() => {
    fetchManualJournals.refetch();
  }, [fetchManualJournals]);

  // Handle fetch data of manual jouranls datatable.
  const handleFetchData = useCallback(({ pageIndex, pageSize, sortBy }) => {
    addManualJournalsTableQueries({
      ...(sortBy.length > 0) ? {
        column_sort_by: sortBy[0].id,
        sort_order: sortBy[0].desc ? 'desc' : 'asc',
      } : {},
    });
  }, [
    addManualJournalsTableQueries,
  ]);

  const handlePublishJournal = useCallback((journal) => {
    requestPublishManualJournal(journal.id).then(() => {
      AppToaster.show({ message: 'the_manual_journal_id_has_been_published' });
    })
  }, [requestPublishManualJournal]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback((accounts) => {
    setSelectedRows(accounts);
  }, [setSelectedRows]);

  return (
    <DashboardInsider
      loading={fetchViews.isFetching || fetchManualJournals.isFetching}
      name={'manual-journals'}>
      <ManualJournalsActionsBar
        onBulkDelete={handleBulkDelete}
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged} />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/dashboard/accounting/manual-journals/:custom_view_id/custom_view',
              '/dashboard/accounting/manual-journals',
            ]}>
            
          </Route>
        </Switch>

        <ManualJournalsDataTable
          onDeleteJournal={handleDeleteJournal}
          onFetchData={handleFetchData}
          onEditJournal={handleEditJournal}
          onPublishJournal={handlePublishJournal}
          onSelectedRowsChange={handleSelectedRowsChange} />

        <Alert
          cancelButtonText='Cancel'
          confirmButtonText='Move to Trash'
          icon='trash'
          intent={Intent.DANGER}
          isOpen={deleteManualJournal}
          onCancel={handleCancelManualJournalDelete}
          onConfirm={handleConfirmManualJournalDelete}
        >
          <p>
            Are you sure you want to move <b>filename</b> to Trash? You will be
            able to restore it later, but it will become private to you.
          </p>
        </Alert>

        <Alert
          cancelButtonText='Cancel'
          confirmButtonText='Move to Trash'
          icon='trash'
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}
        >
          <p>
            Are you sure you want to move <b>filename</b> to Trash? You will be
            able to restore it later, but it will become private to you.
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withManualJournalsActions,
  withViewsActions,
)(ManualJournalsTable);
