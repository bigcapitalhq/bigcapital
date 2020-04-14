import React, { useEffect, useState, useCallback } from 'react';
import {
  Route,
  Switch,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import useAsync from 'hooks/async';
import { Alert, Intent } from '@blueprintjs/core';
import AppToaster from 'components/AppToaster';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import AccountsViewsTabs from 'components/Accounts/AccountsViewsTabs';
import AccountsDataTable from 'components/Accounts/AccountsDataTable';
import DashboardActionsBar from 'components/Accounts/AccountsActionsBar';
import AccountsConnect from 'connectors/Accounts.connector';
import DashboardConnect from 'connectors/Dashboard.connector';
import CustomViewConnect from 'connectors/CustomView.connector';
import ResourceConnect from 'connectors/Resource.connector';
import { compose } from 'utils';

function AccountsChart({
  changePageTitle,
  requestFetchAccounts,
  requestDeleteAccount,
  requestInactiveAccount,
  fetchResourceViews,
  fetchResourceFields,
  getResourceFields,
  requestFetchAccountsTable,
  addAccountsTableQueries
}) {
  const [state, setState] = useState({
    deleteAlertActive: false,
    restoreAlertActive: false,
    inactiveAlertActive: false,
    targetAccount: {},
  });
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [inactiveAccount, setInactiveAccount] = useState(false);
 
  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchResourceViews('accounts'),
      fetchResourceFields('accounts'),
    ]);
  });

  // Fetch accounts list according to the given custom view id.
  const fetchAccountsHook = useAsync(async () => {
    await Promise.all([
      requestFetchAccountsTable(),
    ]);
  }, false);

  useEffect(() => {
    changePageTitle('Chart of Accounts');
  }, []);

  // Handle click and cancel/confirm account delete
  const handleDeleteAccount = (account) => { setDeleteAccount(account); };
  
  // handle cancel delete account alert.
  const handleCancelAccountDelete = () => { setDeleteAccount(false); };
  
  // Handle confirm account delete
  const handleConfirmAccountDelete = useCallback(() => {
    requestDeleteAccount(deleteAccount.id).then(() => {
      setDeleteAccount(false);
      fetchAccountsHook.execute();
      AppToaster.show({ message: 'the_account_has_been_deleted' });
    });
  }, [deleteAccount]);

  // Handle cancel/confirm account inactive.
  const handleInactiveAccount = useCallback((account) => {
    setInactiveAccount(account);
  }, []);

  // Handle cancel inactive account alert.
  const handleCancelInactiveAccount = useCallback(() => {
    setInactiveAccount(false);
  }, []);

  // Handle confirm account activation.
  const handleConfirmAccountActive = useCallback(() => {
    requestInactiveAccount(inactiveAccount.id).then(() => {
      setInactiveAccount(false);
      requestFetchAccountsTable();
      AppToaster.show({ message: 'the_account_has_been_inactivated' });
    });
  }, [inactiveAccount]);

  /**
   * Handle cancel/confirm account restore.
   */
  const handleCancelAccountRestore = () => {
    
  };

  const handleEditAccount = (account) => {

  };

  const handleRestoreAccount = (account) => {
    
  };

  const handleConfirmAccountRestore = (account) => {

  };
  const handleDeleteBulkAccounts = (accounts) => {

  };

  const handleSelectedRowsChange = (accounts) => {
    console.log(accounts);
  };

  const handleFilterChanged = useCallback(() => { 
    fetchAccountsHook.execute();
  }, [fetchAccountsHook]);

  const handleViewChanged = useCallback(() => { fetchAccountsHook.execute(); }, []);
  const handleFetchData = useCallback(({ pageIndex, pageSize, sortBy }) => {
    addAccountsTableQueries({
      ...(sortBy.length > 0) ? {
        column_sort_by: sortBy[0].id,
        sort_by: sortBy[0].desc ? 'desc' : 'asc',
      } : {},
    });
    fetchAccountsHook.execute();
  }, [fetchAccountsHook, addAccountsTableQueries]);

  return (
    <DashboardInsider loading={fetchHook.pending} name={'accounts-chart'}>
      <DashboardActionsBar
        onFilterChanged={handleFilterChanged} />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/dashboard/accounts/:custom_view_id/custom_view',
              '/dashboard/accounts'
            ]}>
            <AccountsViewsTabs
              onViewChanged={handleViewChanged}
              onDeleteBulkAccounts={handleDeleteBulkAccounts} />

            <AccountsDataTable
              onSelectedRowsChange={handleSelectedRowsChange}
              onDeleteAccount={handleDeleteAccount}
              onInactiveAccount={handleInactiveAccount}
              onRestoreAccount={handleRestoreAccount}
              onEditAccount={handleEditAccount}
              onFetchData={handleFetchData} />
          </Route>
        </Switch>

        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Move to Trash"
          icon="trash"
          intent={Intent.DANGER}
          isOpen={deleteAccount}
          onCancel={handleCancelAccountDelete}
          onConfirm={handleConfirmAccountDelete}>
          <p>
          Are you sure you want to move <b>filename</b> to Trash? You will be able to restore it later,
          but it will become private to you.
          </p>
        </Alert>

        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Inactivate"
          icon="trash"
          intent={Intent.WARNING}
          isOpen={inactiveAccount}
          onCancel={handleCancelInactiveAccount}
          onConfirm={handleConfirmAccountActive}>
          <p>
          Are you sure you want to move <b>filename</b> to Trash? You will be able to restore it later,
          but it will become private to you.
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  AccountsConnect,
  CustomViewConnect,
  ResourceConnect,
  DashboardConnect,
)(AccountsChart);