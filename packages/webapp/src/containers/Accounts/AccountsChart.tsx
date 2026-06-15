// @ts-nocheck
import React, { useEffect } from 'react';

import '@/style/pages/Accounts/List.scss';

import { DashboardPageContent, DashboardContentTable } from '@/components';
import { AccountsChartProvider } from './AccountsChartProvider';
import { AccountsActionsBar } from './AccountsActionsBar';
import { AccountsDataTable } from './AccountsDataTable';

import { withAccounts } from '@/containers/Accounts/withAccounts';
import { withAccountsTableActions } from './withAccountsTableActions';

import { transformAccountsStateToQuery } from './utils';
import { flow } from 'fp-ts/function';

/**
 * Accounts chart list.
 */
function AccountsChartInner({
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
        <DashboardContentTable>
          <AccountsDataTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </AccountsChartProvider>
  );
}

export const AccountsChart = flow(
  withAccountsTableActions,
  withAccounts(({ accountsTableState, accountsTableStateChanged }) => ({
    accountsTableState,
    accountsTableStateChanged,
  })),
)(AccountsChartInner);
