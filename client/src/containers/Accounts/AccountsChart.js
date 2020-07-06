import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Alert, Intent } from '@blueprintjs/core';
import { useQuery, queryCache } from 'react-query';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import AppToaster from 'components/AppToaster';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import AccountsViewsTabs from 'containers/Accounts/AccountsViewsTabs';
import AccountsDataTable from 'containers/Accounts/AccountsDataTable';
import DashboardActionsBar from 'containers/Accounts/AccountsActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withAccounts from 'containers/Accounts/withAccounts';

import { compose } from 'utils';

function AccountsChart({
  // #withDashboardActions
  changePageTitle,

  // #withAccountsActions
  requestDeleteAccount,
  requestInactiveAccount,
  requestActivateAccount,

  // #withViewsActions
  requestFetchResourceViews,

  // #withResourceActions
  requestFetchResourceFields,

  // #withAccountsTableActions
  requestFetchAccountsTable,
  requestDeleteBulkAccounts,
  addAccountsTableQueries,
  requestBulkActivateAccounts,
  requestBulkInactiveAccounts,

  // #withAccounts
  accountsTableQuery,
}) {
  const { formatMessage } = useIntl();

  const [deleteAccount, setDeleteAccount] = useState(false);
  const [inactiveAccount, setInactiveAccount] = useState(false);
  const [activateAccount, setActivateAccount] = useState(false);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkActivate, setBulkActivate] = useState(false);
  const [bulkInactiveAccounts, setBulkInactiveAccounts] = useState(false);

  // Fetch accounts resource views and fields.
  const fetchResourceViews = useQuery(
    ['resource-views', 'accounts'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

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

  // Handle click and cancel/confirm account delete
  const handleDeleteAccount = (account) => {
    setDeleteAccount(account);
  };

  // handle cancel delete account alert.
  const handleCancelAccountDelete = useCallback(() => {
    setDeleteAccount(false);
  }, []);

  // Handle delete errors in bulk and singular.
  const handleDeleteErrors = (errors) => {
    if (errors.find((e) => e.type === 'ACCOUNT.PREDEFINED')) {
      AppToaster.show({
        message: formatMessage({
          id: 'you_could_not_delete_predefined_accounts',
        }),
        intent: Intent.DANGER,
      });
    }
    if (errors.find((e) => e.type === 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS')) {
      AppToaster.show({
        message: formatMessage({
          id: 'cannot_delete_account_has_associated_transactions',
        }),
        intent: Intent.DANGER,
      });
    }
  };

  // Handle confirm account delete
  const handleConfirmAccountDelete = useCallback(() => {
    requestDeleteAccount(deleteAccount.id)
      .then(() => {
        setDeleteAccount(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_account_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setDeleteAccount(false);
        handleDeleteErrors(errors);
      });
  }, [deleteAccount, requestDeleteAccount, formatMessage]);

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
    requestInactiveAccount(inactiveAccount.id)
      .then(() => {
        setInactiveAccount(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_account_has_been_successfully_inactivated',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('accounts-table');
      })
      .catch((error) => {
        setInactiveAccount(false);
      });
  }, [inactiveAccount, requestInactiveAccount, formatMessage]);

  // Handle activate account click.
  const handleActivateAccount = useCallback((account) => {
    setActivateAccount(account);
  });

  // Handle activate account alert cancel.
  const handleCancelActivateAccount = useCallback(() => {
    setActivateAccount(false);
  });

  // Handle activate account confirm.
  const handleConfirmAccountActivate = useCallback(() => {
    requestActivateAccount(activateAccount.id)
      .then(() => {
        setActivateAccount(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_account_has_been_successfully_activated',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('accounts-table');
      })
      .catch((error) => {
        setActivateAccount(false);
      });
  }, [activateAccount, requestActivateAccount, formatMessage]);

  const handleRestoreAccount = (account) => {};

  // Handle accounts bulk delete button click.,
  const handleBulkDelete = useCallback(
    (accountsIds) => {
      setBulkDelete(accountsIds);
    },
    [setBulkDelete],
  );

  // Handle confirm accounts bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkAccounts(bulkDelete)
      .then(() => {
        setBulkDelete(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_accounts_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setBulkDelete(false);
        handleDeleteErrors(errors);
      });
  }, [requestDeleteBulkAccounts, bulkDelete, formatMessage]);

  // Handle cancel accounts bulk delete.
  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  const handleBulkArchive = useCallback((accounts) => {}, []);

  const handleEditAccount = useCallback(() => {}, []);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (accounts) => {
      setSelectedRows(accounts);
    },
    [setSelectedRows],
  );

  // Refetches accounts data table when current custom view changed.
  const handleFilterChanged = useCallback(() => {
    fetchAccountsHook.refetch();
  }, [fetchAccountsHook]);

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
    [fetchAccountsHook, addAccountsTableQueries],
  );

  // Calculates the data table selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  // Handle bulk Activate accounts button click.,
  const handleBulkActivate = useCallback(
    (bulkActivateIds) => {
      setBulkActivate(bulkActivateIds);
    },
    [setBulkActivate],
  );

  // Handle cancel Bulk Activate accounts bulk delete.
  const handleCancelBulkActivate = useCallback(() => {
    setBulkActivate(false);
  }, []);

  // Handle Bulk activate account confirm.
  const handleConfirmBulkActivate = useCallback(() => {
    requestBulkActivateAccounts(bulkActivate)
      .then(() => {
        setBulkActivate(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_accounts_has_been_successfully_activated',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setBulkActivate(false);
      });
  }, [requestBulkActivateAccounts, bulkActivate, formatMessage]);

  // Handle bulk Inactive accounts button click.,
  const handleBulkInactive = useCallback(
    (bulkInactiveIds) => {
      setBulkInactiveAccounts(bulkInactiveIds);
    },
    [setBulkInactiveAccounts],
  );

  // Handle cancel Bulk Inactive accounts bulk delete.
  const handleCancelBulkInactive = useCallback(() => {
    setBulkInactiveAccounts(false);
  }, []);

  // Handle Bulk Inactive accounts confirm.
  const handleConfirmBulkInactive = useCallback(() => {
    requestBulkInactiveAccounts(bulkInactiveAccounts)
      .then(() => {
        setBulkInactiveAccounts(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_accounts_have_been_successfully_inactivated',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setBulkInactiveAccounts(false);
      });
  }, [requestBulkInactiveAccounts, bulkInactiveAccounts]);

  return (
    <DashboardInsider
      loading={fetchResourceFields.isFetching || fetchResourceViews.isFetching}
      name={'accounts-chart'}
    >
      <DashboardActionsBar
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
        onBulkDelete={handleBulkDelete}
        onBulkArchive={handleBulkArchive}
        onBulkActivate={handleBulkActivate}
        onBulkInactive={handleBulkInactive}
      />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={['/accounts/:custom_view_id/custom_view', '/accounts']}
          >
            <AccountsViewsTabs />

            <AccountsDataTable
              onDeleteAccount={handleDeleteAccount}
              onInactiveAccount={handleInactiveAccount}
              onActivateAccount={handleActivateAccount}
              onRestoreAccount={handleRestoreAccount}
              onEditAccount={handleEditAccount}
              onFetchData={handleFetchData}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={deleteAccount}
          onCancel={handleCancelAccountDelete}
          onConfirm={handleConfirmAccountDelete}
        >
          <p>
            <FormattedHTMLMessage
              id={'once_delete_this_account_you_will_able_to_restore_it'}
            />
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'inactivate'} />}
          intent={Intent.WARNING}
          isOpen={inactiveAccount}
          onCancel={handleCancelInactiveAccount}
          onConfirm={handleConfirmAccountActive}
        >
          <p>
            <T id={'are_sure_to_inactive_this_account'} />
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'activate'} />}
          intent={Intent.WARNING}
          isOpen={activateAccount}
          onCancel={handleCancelActivateAccount}
          onConfirm={handleConfirmAccountActivate}
        >
          <p>
            <T id={'are_sure_to_activate_this_account'} />
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={`${formatMessage({
            id: 'delete',
          })} (${selectedRowsCount})`}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}
        >
          <p>
            <T
              id={'once_delete_these_accounts_you_will_not_able_restore_them'}
            />
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={`${formatMessage({
            id: 'activate',
          })} (${selectedRowsCount})`}
          intent={Intent.WARNING}
          isOpen={bulkActivate}
          onCancel={handleCancelBulkActivate}
          onConfirm={handleConfirmBulkActivate}
        >
          <p>
            <T id={'are_sure_to_activate_this_accounts'} />
          </p>
        </Alert>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={`${formatMessage({
            id: 'inactivate',
          })} (${selectedRowsCount})`}
          intent={Intent.WARNING}
          isOpen={bulkInactiveAccounts}
          onCancel={handleCancelBulkInactive}
          onConfirm={handleConfirmBulkInactive}
        >
          <p>
            <T id={'are_sure_to_inactive_this_accounts'} />
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
  withAccounts(({ accountsTableQuery }) => ({
    accountsTableQuery,
  })),
)(AccountsChart);
