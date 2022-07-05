import React, { useEffect } from 'react';

import '@/style/pages/Accounts/List.scss';
import { DashboardPageContent, DashboardContentTable } from '@/components';

import { AccountsChartProvider } from './AccountsChartProvider';

import AccountsViewsTabs from '@/containers/Accounts/AccountsViewsTabs';
import AccountsActionsBar from '@/containers/Accounts/AccountsActionsBar';
import AccountsDataTable from './AccountsDataTable';

import withAccounts from '@/containers/Accounts/withAccounts';

import { compose } from '@/utils';
import { transformAccountsStateToQuery } from './utils';
import withAccountsTableActions from './withAccountsTableActions';

/**
 * Accounts chart list.
 */
function AccountsChart({
  // #withAccounts
  accountsTableState,
  accountsTableStateChanged,

  // #withAccountsActions
  resetAccountsTableState,
}) {
  // Resets the accounts table state once the page unmount.
  useEffect(
    () => () => {
      resetAccountsTableState();
    },
    [resetAccountsTableState],
  );

  return (
    <AccountsChartProvider
      query={transformAccountsStateToQuery(accountsTableState)}
      tableStateChanged={accountsTableStateChanged}
    >
      <AccountsActionsBar />

      <DashboardPageContent>
        <AccountsViewsTabs />

        <DashboardContentTable>
          <AccountsDataTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </AccountsChartProvider>
  );
}

export default compose(
  withAccounts(({ accountsTableState, accountsTableStateChanged }) => ({
    accountsTableState,
    accountsTableStateChanged,
  })),
  withAccountsTableActions,
)(AccountsChart);
