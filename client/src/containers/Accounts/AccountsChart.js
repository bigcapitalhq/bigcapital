import React, { useEffect, useState, useCallback } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { Alert, Intent } from '@blueprintjs/core';
import { useQuery } from 'react-query'

import AppToaster from 'components/AppToaster';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import AccountsViewsTabs from 'containers/Accounts/AccountsViewsTabs';
import AccountsDataTable from 'containers/Accounts/AccountsDataTable';
import DashboardActionsBar from 'containers/Accounts/AccountsActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboard';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withAccounts from 'containers/Accounts/withAccounts';

import { compose } from 'utils';

import { FormattedMessage as T, useIntl } from 'react-intl';

function AccountsChart({

  // #withDashboard
  changePageTitle,

  // #withAccountsActions
  requestDeleteAccount,
  requestInactiveAccount,

  // #withViewsActions
  requestFetchResourceViews,

  // #withResourceActions
  requestFetchResourceFields,

  // #withAccountsTableActions
  requestFetchAccountsTable,
  requestDeleteBulkAccounts,
  addAccountsTableQueries,

  // #withAccounts
  accountsTableQuery,
}) {
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [inactiveAccount, setInactiveAccount] = useState(false);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [tableLoading, setTableLoading] = useState(false);

  // Fetch accounts resource views and fields.
  const fetchHook = useQuery('resource-accounts', () => {
    return Promise.all([
      requestFetchResourceViews('accounts'),
      requestFetchResourceFields('accounts'),
    ]);
  });

  // Fetch accounts list according to the given custom view id.
  const fetchAccountsHook = useQuery(['accounts-table', accountsTableQuery],
    () => requestFetchAccountsTable());

  useEffect(() => {
    changePageTitle('Chart of Accounts');
  }, [changePageTitle]);
  
  // Handle click and cancel/confirm account delete
  const handleDeleteAccount = (account) => { setDeleteAccount(account); };
  
  // handle cancel delete account alert.
  const handleCancelAccountDelete = useCallback(() => { setDeleteAccount(false); }, []);
  
  // Handle confirm account delete
  const handleConfirmAccountDelete = useCallback(() => {
    requestDeleteAccount(deleteAccount.id).then(() => {
      setDeleteAccount(false);
      AppToaster.show({ message: 'the_account_has_been_deleted' });
    }).catch(errors => {
      setDeleteAccount(false);
      if (errors.find((e) => e.type === 'ACCOUNT.PREDEFINED')) {
        AppToaster.show({
          message: 'cannot_delete_predefined_account',
          intent: Intent.DANGER,
        });
      }
      if (errors.find((e) => e.type === 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS')) {
        AppToaster.show({
          message: 'cannot_delete_account_has_associated_transactions'
        });
      }
    });
  }, [deleteAccount, requestDeleteAccount]);

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
  }, [inactiveAccount, requestFetchAccountsTable, requestInactiveAccount]);


  const handleEditAccount = (account) => {

  };

  const handleRestoreAccount = (account) => {
    
  };

  const handleBulkDelete = useCallback((accountsIds) => {
    setBulkDelete(accountsIds);
  }, [setBulkDelete]);

  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkAccounts(bulkDelete).then(() => {
      setBulkDelete(false);
      AppToaster.show({ message: 'the_accounts_have_been_deleted' });
    }).catch((error) => {
      setBulkDelete(false);
    });
  }, [requestDeleteBulkAccounts, bulkDelete]);

  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  const handleBulkArchive = useCallback((accounts) => {

  }, []);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback((accounts) => {
    setSelectedRows(accounts);
  }, [setSelectedRows]);

  // Refetches accounts data table when current custom view changed.
  const handleFilterChanged = useCallback(() => { 
    fetchAccountsHook.refetch();
  }, [fetchAccountsHook]);

  // Refetch accounts data table when current custom view changed.
  const handleViewChanged = useCallback(async () => {
    setTableLoading(true);
  }, [fetchAccountsHook]);

  useEffect(() => {
    if (tableLoading && !fetchAccountsHook.isFetching) {
      setTableLoading(false);
    }
  }, [tableLoading, fetchAccountsHook.isFetching]);

  // Handle fetch data of accounts datatable.
  const handleFetchData = useCallback(({ pageIndex, pageSize, sortBy }) => {
    addAccountsTableQueries({
      ...(sortBy.length > 0) ? {
        column_sort_by: sortBy[0].id,
        sort_order: sortBy[0].desc ? 'desc' : 'asc',
      } : {},
    });
    fetchAccountsHook.refetch();
  }, [fetchAccountsHook, addAccountsTableQueries]);

  return (
    <DashboardInsider
      loading={fetchHook.isFetching}
      name={'accounts-chart'}>
      <DashboardActionsBar
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
        onBulkDelete={handleBulkDelete}
        onBulkArchive={handleBulkArchive} />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/dashboard/accounts/:custom_view_id/custom_view',
              '/dashboard/accounts',
            ]}>
            <AccountsViewsTabs
              onViewChanged={handleViewChanged} />

            <AccountsDataTable
              onDeleteAccount={handleDeleteAccount}
              onInactiveAccount={handleInactiveAccount}
              onRestoreAccount={handleRestoreAccount}
              onEditAccount={handleEditAccount}
              onFetchData={handleFetchData}
              onSelectedRowsChange={handleSelectedRowsChange}
              loading={tableLoading} />
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
          cancelButtonText={<T id={'cancel'}/>}
          confirmButtonText={<T id={'inactivate'}/>}
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

        <Alert
       cancelButtonText={<T id={'cancel'}/>}
          confirmButtonText={<T id={'delete'}/>}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}>
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
  withAccountsActions,
  withAccountsTableActions,
  withViewsActions,
  withResourceActions,
  withDashboardActions,

  withAccounts,
)(AccountsChart);