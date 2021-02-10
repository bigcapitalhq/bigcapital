import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import 'style/pages/Accounts/List.scss';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { AccountsChartProvider } from './AccountsChartProvider';

import AccountsViewsTabs from 'containers/Accounts/AccountsViewsTabs';
import AccountsActionsBar from 'containers/Accounts/AccountsActionsBar';
import AccountsAlerts from './AccountsAlerts';
import AccountsDataTable from './AccountsDataTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccounts from 'containers/Accounts/withAccounts';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Accounts chart list.
 */
function AccountsChart({
  // #withDashboardActions
  changePageTitle,

  // #withAccounts
  accountsTableState,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'chart_of_accounts' }));
  }, [changePageTitle, formatMessage]);

  return (
    <AccountsChartProvider
      query={transformTableStateToQuery(accountsTableState)}
    >
      <AccountsActionsBar />

      <DashboardPageContent>
        <AccountsViewsTabs />
        <AccountsDataTable />
      </DashboardPageContent>

      <AccountsAlerts />
    </AccountsChartProvider>
  );
}

export default compose(
  withDashboardActions,
  withAccounts(({ accountsTableState }) => ({ accountsTableState })),
)(AccountsChart);
