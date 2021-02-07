import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import 'style/pages/Accounts/List.scss';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { AccountsChartProvider } from 'containers/Accounts/AccountsChartProvider';
import AccountsViewPage from 'containers/Accounts/AccountsViewPage';
import AccountsActionsBar from 'containers/Accounts/AccountsActionsBar';
import AccountsAlerts from './AccountsAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccounts from 'containers/Accounts/withAccounts';

import { compose } from 'utils';

/**
 * Accounts chart list.
 */
function AccountsChart({
  // #withDashboardActions
  changePageTitle,

  // #withAccounts
  accountsTableQuery
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'chart_of_accounts' }));
  }, [changePageTitle, formatMessage]);

  return (
    <AccountsChartProvider query={accountsTableQuery}>
      <AccountsActionsBar />

      <DashboardPageContent>
        <AccountsViewPage />
      </DashboardPageContent>

      <AccountsAlerts />
    </AccountsChartProvider>
  );
}

export default compose(
  withDashboardActions,
  withAccounts(({ accountsTableQuery }) => ({
    accountsTableQuery,
  })),
)(AccountsChart);
