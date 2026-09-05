import { useEffect } from 'react';
import '@/style/pages/Accounts/List.scss';
import { AccountsActionsBar } from './AccountsActionsBar';
import { AccountsChartDialogs } from './AccountsChartDialogs';
import { AccountsChartDrawers } from './AccountsChartDrawers';
import { AccountsChartProvider } from './AccountsChartProvider';
import { AccountsDataTable } from './AccountsDataTable';
import { transformAccountsStateToQuery } from './utils';
import { withAccountsTableActions } from './withAccountsTableActions';
import type { WithAccountsTableActionsProps } from './withAccountsTableActions';
import type { WithAccountsProps } from '@/containers/Accounts/withAccounts';
import { DashboardPageContent, DashboardContentTable } from '@/components';
import { withAccounts } from '@/containers/Accounts/withAccounts';
import { compose } from '@/utils';

interface AccountsChartInnerProps {
  accountsTableState: WithAccountsProps['accountsTableState'];
  accountsTableStateChanged: WithAccountsProps['accountsTableStateChanged'];
  resetAccountsTableState: WithAccountsTableActionsProps['resetAccountsTableState'];
  resetAccountsSelectedRows: WithAccountsTableActionsProps['resetAccountsSelectedRows'];
}

/**
 * Accounts chart list.
 */
function AccountsChartInner({
  accountsTableState,
  accountsTableStateChanged,

  resetAccountsTableState,
  resetAccountsSelectedRows,
}: AccountsChartInnerProps) {
  // Resets the accounts table state and selected rows once the page unmount.
  useEffect(
    () => () => {
      resetAccountsTableState();
      resetAccountsSelectedRows();
    },
    [resetAccountsSelectedRows, resetAccountsTableState],
  );

  return (
    <AccountsChartProvider
      query={transformAccountsStateToQuery(accountsTableState)}
      tableStateChanged={accountsTableStateChanged}
    >
      <AccountsActionsBar />
      <AccountsChartDrawers />
      <AccountsChartDialogs />

      <DashboardPageContent>
        <DashboardContentTable>
          <AccountsDataTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </AccountsChartProvider>
  );
}

export const AccountsChart = compose(
  withAccounts(({ accountsTableState, accountsTableStateChanged }) => ({
    accountsTableState,
    accountsTableStateChanged,
  })),
  withAccountsTableActions,
)(AccountsChartInner);
