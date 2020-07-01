import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Classes,
  Tooltip,
  Intent,
} from '@blueprintjs/core';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';

import Icon from 'components/Icon';
import { compose } from 'utils';

import LoadingIndicator from 'components/LoadingIndicator';
import DataTable from 'components/DataTable';
import Money from 'components/Money';
import { useUpdateEffect } from 'hooks';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccounts from 'containers/Accounts/withAccounts';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withCurrentView from 'containers/Views/withCurrentView';

import { If } from 'components';

function AccountsDataTable({
  // #withDashboardActions
  accounts,
  accountsLoading,

  // #withDialog.
  openDialog,

  currentViewId,

  // own properties
  loading,
  onFetchData,
  onSelectedRowsChange,
  onDeleteAccount,
  onInactiveAccount,
  onActivateAccount,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setIsMounted(false);
  }, [currentViewId]);

  useUpdateEffect(() => {
    if (!accountsLoading) {
      setIsMounted(true);
    }
  }, [accountsLoading, setIsMounted]);

  const handleEditAccount = useCallback(
    (account) => () => {
      openDialog('account-form', { action: 'edit', id: account.id });
    },
    [openDialog],
  );

  const handleNewParentAccount = useCallback(
    (account) => {
      openDialog('account-form', {
        action: 'new_child',
        parentAccountId: account.id,
        accountTypeId: account.account_type_id,
        subaccount: true,
      });
    },
    [openDialog],
  );

  const actionMenuList = useCallback(
    (account) => (
      <Menu>
        <MenuItem text={formatMessage({ id: 'view_details' })} />
        <MenuDivider />
        <MenuItem
          text={formatMessage({ id: 'edit_account' })}
          onClick={handleEditAccount(account)}
        />
        <MenuItem
          text={formatMessage({ id: 'new_child_account' })}
          onClick={() => handleNewParentAccount(account)}
        />
        <MenuDivider />
        <If condition={account.active}>
          <MenuItem
            text={formatMessage({ id: 'inactivate_account' })}
            onClick={() => onInactiveAccount(account)}
          />
        </If>
        <If condition={!account.active}>
          <MenuItem
            text={formatMessage({ id: 'activate_account' })}
            onClick={() => onActivateAccount(account)}
          />
        </If>
        <MenuItem
          text={formatMessage({ id: 'delete_account' })}
          intent={Intent.DANGER}
          onClick={() => onDeleteAccount(account)}
        />
      </Menu>
    ),
    [
      handleEditAccount,
      onDeleteAccount,
      onInactiveAccount,
      handleNewParentAccount,
      formatMessage,
    ],
  );

  const rowContextMenu = (cell) => {
    return actionMenuList(cell.row.original);
  };

  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: formatMessage({ id: 'account_name' }),
        accessor: (row) => {
          return row.description ? (
            <Tooltip
              className={Classes.TOOLTIP_INDICATOR}
              content={row.description}
              position={Position.RIGHT_TOP}
              hoverOpenDelay={500}
            >
              {row.name}
            </Tooltip>
          ) : (
            row.name
          );
        },
        className: 'account_name',
        width: 220,
      },
      {
        id: 'code',
        Header: formatMessage({ id: 'code' }),
        accessor: 'code',
        className: 'code',
        width: 125,
      },
      {
        id: 'type',
        Header: formatMessage({ id: 'type' }),
        accessor: 'type.name',
        className: 'type',
        width: 140,
      },
      {
        id: 'normal',
        Header: formatMessage({ id: 'normal' }),
        Cell: ({ cell }) => {
          const account = cell.row.original;
          const normal = account.type ? account.type.normal : '';
          const arrowDirection = normal === 'credit' ? 'down' : 'up';

          return (
            <Tooltip
              className={Classes.TOOLTIP_INDICATOR}
              content={formatMessage({ id: normal })}
              position={Position.RIGHT}
              hoverOpenDelay={500}
            >
              <Icon icon={`arrow-${arrowDirection}`} />
            </Tooltip>
          );
        },
        className: 'normal',
        width: 115,
      },
      {
        id: 'balance',
        Header: formatMessage({ id: 'balance' }),
        Cell: ({ cell }) => {
          const account = cell.row.original;
          const { balance = null } = account;

          return balance ? (
            <span>
              <Money amount={balance.amount} currency={balance.currency_code} />
            </span>
          ) : (
            <span class="placeholder">--</span>
          );
        },
        width: 150,
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_TOP}
          >
            <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const selectionColumn = useMemo(
    () => ({
      minWidth: 40,
      width: 40,
      maxWidth: 40,
    }),
    [],
  );

  const handleDatatableFetchData = useCallback((...params) => {
    onFetchData && onFetchData(...params);
  }, []);

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );

  return (
    <LoadingIndicator loading={loading && !isMounted} mount={false}>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={accounts}
        onFetchData={handleDatatableFetchData}
        manualSortBy={true}
        selectionColumn={selectionColumn}
        expandable={true}
        treeGraph={true}
        sticky={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        loading={accountsLoading && !isMounted}
        spinnerProps={{ size: 30 }}
        rowContextMenu={rowContextMenu}
      />
    </LoadingIndicator>
  );
}

export default compose(
  withRouter,
  withCurrentView,
  withDialogActions,
  withDashboardActions,
  withAccountsActions,
  withAccounts(({ accountsLoading, accounts }) => ({
    accountsLoading,
    accounts,
  })),
)(AccountsDataTable);
