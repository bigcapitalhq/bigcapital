import React, { useEffect, useState } from 'react';
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
  fetchAccounts,
  deleteAccount,
  inactiveAccount,
  fetchResourceViews,
  fetchResourceFields,
  getResourceFields,
}) {
  const [state, setState] = useState({
    deleteAlertActive: false,
    restoreAlertActive: false,
    inactiveAlertActive: false,
    targetAccount: {},
  });

  const [filterConditions, setFilterConditions] = useState([]);
 
  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchResourceViews('accounts'),
      fetchResourceFields('accounts'),
    ]);
  });

  useEffect(() => {
    changePageTitle('Chart of Accounts');
  }, []);

  /**
   * Handle click and cancel/confirm account delete
   */
  const handleDeleteAccount = (account) => {
    setState({
      deleteAlertActive: true,
      deleteAccount: account,
    });
  };
 
  const handleCancelAccountDelete = () => {
    setState({ deleteAlertActive: false });
  };
  const handleConfirmAccountDelete = () => {
    const { targetAccount: account } = state;
    deleteAccount(account.id).then(() => {
      setState({ deleteAlertActive: false });
      fetchAccounts();
      AppToaster.show({ message: 'the_account_has_been_deleted' });
    });
  };

  /**
   * Handle cancel/confirm account inactive.
   */
  const handleInactiveAccount = (account) => {
    setState({ inactiveAlertActive: true, targetAccount: account });
  };

  const handleCancelInactiveAccount = () => {
    setState({ inactiveAlertActive: false });
  };

  const handleConfirmAccountActive = () => {
    const { targetAccount: account } = state;
    inactiveAccount(account.id).then(() => {
      setState({ inactiveAlertActive: true });
      fetchAccounts();
      AppToaster.show({ message: 'the_account_has_been_inactivated' });
    });
  };

  /**
   * Handle cancel/confirm account restore.
   */
  const handleCancelAccountRestore = () => {
    setState({ restoreAlertActive: false });
  };

  const handleEditAccount = (account) => {

  };

  const handleRestoreAccount = (account) => {
    
  };

  const handleConfirmAccountRestore = (account) => {

  };

  const handleDeleteBulkAccounts = (accounts) => {

  };
  const handleFilterChange = (conditions) => { setFilterConditions(conditions); };

  return (
    <DashboardInsider loading={fetchHook.pending} name={'accounts-chart'}>
      <DashboardActionsBar
        onFilterChange={handleFilterChange} />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/dashboard/accounts/:custom_view_id/custom_view',
              '/dashboard/accounts'
            ]}>
            <AccountsViewsTabs onDeleteBulkAccounts={handleDeleteBulkAccounts} />
 
            <AccountsDataTable
              filterConditions={filterConditions}
              onDeleteAccount={handleDeleteAccount}
              onInactiveAccount={handleInactiveAccount}
              onRestoreAccount={handleRestoreAccount}
              onEditAccount={handleEditAccount} />
          </Route>
        </Switch>

        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Move to Trash"
          icon="trash"
          intent={Intent.DANGER}
          isOpen={state.deleteAlertActive}
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
          isOpen={state.inactiveAlertActive}
          onCancel={handleCancelInactiveAccount}
          onConfirm={handleConfirmAccountActive}>
          <p>
          Are you sure you want to move <b>filename</b> to Trash? You will be able to restore it later,
          but it will become private to you.
          </p>
        </Alert>

        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Move to Trash"
          icon="trash"
          intent={Intent.DANGER}
          isOpen={state.restoreAlertActive}
          onCancel={handleCancelAccountRestore}
          onConfirm={handleConfirmAccountRestore}>
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