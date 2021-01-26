import React, { useEffect, useState, useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  useIntl,
} from 'react-intl';

import 'style/pages/Accounts/List.scss';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import AccountsViewPage from 'containers/Accounts/AccountsViewPage';
import AccountsActionsBar from 'containers/Accounts/AccountsActionsBar';
import AccountsAlerts from './AccountsAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withAccounts from 'containers/Accounts/withAccounts';

import { compose } from 'utils';

/**
 * Accounts chart list.
 */
function AccountsChart({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,

  // #withResourceActions
  requestFetchResourceFields,

  // #withAccountsTableActions
  requestFetchAccountsTable,
  addAccountsTableQueries,

  // #withAccounts
  accountsTableQuery,
}) {
  const { formatMessage } = useIntl();

  // Fetch accounts resource views and fields.
  const fetchResourceViews = useQuery(
    ['resource-views', 'accounts'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );
  // Fetch the accounts resource fields.
  const fetchResourceFields = useQuery(
    ['resource-fields', 'accounts'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );
  // Fetch accounts list according to the given custom view id.
  const fetchAccountsHook = useQuery(
    ['accounts-table', accountsTableQuery],
    (key, q) => requestFetchAccountsTable(),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'chart_of_accounts' }));
  }, [changePageTitle, formatMessage]);

  // Refetches accounts data table when current custom view changed.
  const handleFilterChanged = useCallback(() => {
    
  }, []);

  // Handle fetch data of accounts datatable.
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addAccountsTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
      });
    },
    [addAccountsTableQueries],
  );

  return (
    <DashboardInsider
      loading={fetchResourceFields.isFetching || fetchResourceViews.isFetching}
      name={'accounts-chart'}
    >
      <AccountsActionsBar
        onFilterChanged={handleFilterChanged}
      />
      <DashboardPageContent>
        <AccountsViewPage />
      </DashboardPageContent>

      <AccountsAlerts />
    </DashboardInsider>
  );
}

export default compose(
  withAccountsActions,
  withAccountsTableActions,
  withViewsActions,
  withResourceActions,
  withDashboardActions,
  withAccounts(({ accountsTableQuery }) => ({
    accountsTableQuery,
  })),
)(AccountsChart);
