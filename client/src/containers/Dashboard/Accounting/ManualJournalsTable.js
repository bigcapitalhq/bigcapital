import React, { useEffect, useState, useCallback } from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import useAsync from 'hooks/async';
import { Alert, Intent } from '@blueprintjs/core';
import AppToaster from 'components/AppToaster';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ManualJournalsViewTabs from 'components/JournalEntry/ManualJournalsViewTabs';
import ManualJournalsDataTable from 'components/JournalEntry/ManualJournalsDataTable';
import DashboardActionsBar from 'components/JournalEntry/ManualJournalActionsBar';
import ManualJournalsConnect from 'connectors/ManualJournals.connect';
import DashboardConnect from 'connectors/Dashboard.connector';
import CustomViewConnect from 'connectors/CustomView.connector';
import ResourceConnect from 'connectors/Resource.connector';
import { compose } from 'utils';

function ManualJournalsTable({
  changePageTitle,
  fetchResourceViews,
  fetchManualJournalsTable,
  requestDeleteManualJournal,
}) {
  const [deleteManualJournal, setDeleteManualJournal] = useState(false);

  const fetchHook = useAsync(async () => {
    await Promise.all([fetchResourceViews('manual_journals')]);
  });

  const fetchManualJournalsHook = useAsync(async () => {
    await Promise.all([fetchManualJournalsTable()]);
  }, false);

  useEffect(() => {
    changePageTitle('Manual Journals');
  }, []);

  const handleCancelManualJournalDelete = () => {
    setDeleteManualJournal(false);
  };

  const handleConfirmManualJournalDelete = useCallback(() => {
    requestDeleteManualJournal(deleteManualJournal.id).then(() => {
      setDeleteManualJournal(false);
      fetchManualJournalsHook.execute();
      AppToaster.show({ message: 'the_manual_Journal_has_been_deleted' });
    });
  }, [deleteManualJournal]);
  const handleFilterChanged = useCallback(() => {
    fetchManualJournalsHook.execute();
  }, []);
  const handleViewChanged = useCallback(() => {
    fetchManualJournalsHook.execute();
  }, []);
  const handleFetchData = useCallback(() => {
    fetchManualJournalsHook.execute();
  }, []);

  return (
    <DashboardInsider loading={fetchHook.pending} name={'manual-journal'}>
      <DashboardActionsBar onFilterChanged={handleFilterChanged} />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/dashboard/accounting/manual-journals/:custom_view_id/custom_view',
              '/dashboard/accounting/manual-journals',
            ]}
          >
            <ManualJournalsViewTabs onViewChanged={handleViewChanged} />
          </Route>
        </Switch>
        <ManualJournalsDataTable onFetchData={handleFetchData} />

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
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  ManualJournalsConnect,
  CustomViewConnect,
  ResourceConnect,
  DashboardConnect
)(ManualJournalsTable);
