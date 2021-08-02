import React from 'react';

import 'style/pages/Accounts/List.scss';
import { DashboardPageContent, DashboardContentTable } from 'components';

import { AccountsChartProvider } from './AccountsChartProvider';

import AccountsViewsTabs from 'containers/Accounts/AccountsViewsTabs';
import AccountsActionsBar from 'containers/Accounts/AccountsActionsBar';
import AccountsAlerts from './AccountsAlerts';
import AccountsDataTable from './AccountsDataTable';

import withAccounts from 'containers/Accounts/withAccounts';

import { compose } from 'utils';
import { transformAccountsStateToQuery } from './utils';

/**
 * Accounts chart list.
 */
function AccountsChart({
  // #withAccounts
  accountsTableState,
}) {
  return (
    <AccountsChartProvider
      query={transformAccountsStateToQuery(accountsTableState)}
    >
      <AccountsActionsBar />

      <DashboardPageContent>
        <AccountsViewsTabs />

        <DashboardContentTable>
          <AccountsDataTable />
        </DashboardContentTable>
      </DashboardPageContent>

      <AccountsAlerts />
    </AccountsChartProvider>
  );
}

export default compose(
  withAccounts(({ accountsTableState }) => ({ accountsTableState })),
)(AccountsChart);
