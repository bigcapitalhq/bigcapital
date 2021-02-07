import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AccountsViewsTabs from 'containers/Accounts/AccountsViewsTabs';
import AccountsDataTable from 'containers/Accounts/AccountsDataTable';
import { useAccountsChartContext } from 'containers/Accounts/AccountsChartProvider';

import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Accounts view page.
 */
function AccountsViewPage({
  // #withAlertActions
  openAlert,

  // #withDialog.
  openDialog,

  // #withAccountsTableActions
  setSelectedRowsAccounts,
}) {
  const { isAccountsLoading, accounts } = useAccountsChartContext();

  // Handle delete action account.
  const handleDeleteAccount = (account) => {
    // openAlert('account-delete', { accountId: account.id });
  };

  // Handle activate action account.
  const handleActivateAccount = (account) => {
    // openAlert('account-activate', { accountId: account.id });
  };

  // Handle inactivate action account.
  const handleInactivateAccount = (account) => {
    // openAlert('account-inactivate', { accountId: account.id });
  };

  // Handle select accounts datatable rows.
  //   const handleSelectedRowsChange = (selectedRows) => {
  //     const selectedRowsIds = selectedRows.map((r) => r.id);
  //     setSelectedRowsAccounts(selectedRowsIds);
  //   };

  // Handle edit account action.
  const handleEditAccount = (account) => {
    // openDialog('account-form', { action: 'edit', id: account.id });
  };

  // Handle new child button click.
  const handleNewChildAccount = (account) => {
    // openDialog('account-form', {
    //   action: 'new_child',
    //   parentAccountId: account.id,
    //   accountType: account.account_type,
    // });
  };

  return (
    <Switch>
      <Route
        exact={true}
        path={['/accounts/:custom_view_id/custom_view', '/accounts']}
      >
        <AccountsViewsTabs />

        <AccountsDataTable
          loading={isAccountsLoading}
          accounts={accounts}
          // onDeleteAccount={handleDeleteAccount}
          // onInactivateAccount={handleInactivateAccount}
          // onActivateAccount={handleActivateAccount}
          // onSelectedRowsChange={handleSelectedRowsChange}
          // onEditAccount={handleEditAccount}
          // onNewChildAccount={handleNewChildAccount}
        />
      </Route>
    </Switch>
  );
}

export default compose(
  withAlertsActions,
  withAccountsTableActions,
  withDialogActions,
)(AccountsViewPage);
