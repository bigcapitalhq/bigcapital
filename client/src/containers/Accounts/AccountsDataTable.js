import React, {useCallback, useState, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Classes,
  Tooltip,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';

import Icon from 'components/Icon';
import { compose } from 'utils';
import DialogConnect from 'connectors/Dialog.connector';
import LoadingIndicator from 'components/LoadingIndicator';
import DataTable from 'components/DataTable';
import Money from 'components/Money';
import { useUpdateEffect } from 'hooks';

import withDashboardActions from 'containers/Dashboard/withDashboard';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccounts from 'containers/Accounts/withAccounts';

import { If } from 'components';


function AccountsDataTable({
  // #withAccounts  
  accounts,
  accountsLoading,
  
  // #withDialog.
  openDialog,

  // own properties
  loading,
  onFetchData,
  onSelectedRowsChange,
  onDeleteAccount,
  onInactiveAccount,
  onActivateAccount,
}) {
  const [initialMount, setInitialMount] = useState(false);
  const { formatMessage } = useIntl();

  useUpdateEffect(() => {
    if (!accountsLoading) {
      setInitialMount(true);
    }
  }, [accountsLoading, setInitialMount]);

  const handleEditAccount = useCallback((account) => () => {
    openDialog('account-form', { action: 'edit', id: account.id });
  }, [openDialog]);

  const handleNewParentAccount = useCallback((account) => {
    openDialog('account-form', { action: 'new_child', id: account.id });
  }, [openDialog]);

  const actionMenuList = useCallback((account) => (
    <Menu>
      <MenuItem text={<T id={'view_details'}/>} />
      <MenuDivider />
      <MenuItem
        text={<T id={'edit_account'}/>}
        onClick={handleEditAccount(account)} />
      <MenuItem
        text={<T id={'new_account'}/>}
        onClick={() => handleNewParentAccount(account)} />
      <MenuDivider />
      <If condition={account.active}>
        <MenuItem
          text={<T id={'inactivate_account'}/>}
          onClick={() => onInactiveAccount(account)} />
      </If>
      <If condition={!account.active}>
        <MenuItem
          text={<T id={'activate_account'}/>}
          onClick={() => onActivateAccount(account)} />
      </If>
      <MenuItem
        text={<T id={'delete_account'}/>}
        onClick={() => onDeleteAccount(account)} />
    </Menu>
  ), [handleEditAccount, onDeleteAccount, onInactiveAccount,handleNewParentAccount]);

  const columns = useMemo(() => [
    {
      id: 'name',
      Header: formatMessage({id:'account_name'}),
      accessor: row => {
        return (row.description) ?
          (<Tooltip
            className={Classes.TOOLTIP_INDICATOR}
            content={row.description}
            position={Position.RIGHT_TOP}
            hoverOpenDelay={500}>
              { row.name }
          </Tooltip>) : row.name;
      },
      className: 'account_name',
      width: 300,
    },
    {
      id: 'code',
      Header: formatMessage({id:'code'}),
      accessor: 'code',
      className: 'code',
      width: 100,
    },
    {
      id: 'type',
      Header: formatMessage({id:'type'}),
      accessor: 'type.name',
      className: 'type',
      width: 120,
    },
    {
      id: 'normal',
      Header: formatMessage({id:'normal'}),
      Cell: ({ cell }) => {
        const account = cell.row.original;
        const normal = account.type ? account.type.normal : '';
        const arrowDirection = normal === 'credit' ? 'down' : 'up';

        return (
          <Tooltip
            className={Classes.TOOLTIP_INDICATOR}
            content={formatMessage({ id: normal })}
            position={Position.RIGHT}
            hoverOpenDelay={500}>
            <Icon icon={`arrow-${arrowDirection}`} />
          </Tooltip>
        );
      },
      className: 'normal',
      width: 75,
    },
    {
      id: 'balance',
      Header: formatMessage({id:'balance'}),
      Cell: ({ cell }) => {
        const account = cell.row.original;
        const {balance = null} = account;

        return (balance) ?
          (<span>
            <Money amount={balance.amount} currency={balance.currency_code} />
            </span>) :
          (<span class="placeholder">--</span>);
      },
      width: 150,
    },
    {
      id: 'actions',
      Header: '',
      Cell: ({ cell }) => (
        <Popover
          content={actionMenuList(cell.row.original)}
          position={Position.RIGHT_TOP}>
          <Button icon={<Icon icon='ellipsis-h' />} />
        </Popover>
      ),
      className: 'actions',
      width: 50,
    }
  ], [actionMenuList,formatMessage]);

  const selectionColumn = useMemo(() => ({
    minWidth: 50,
    width: 50,
    maxWidth: 50,
  }), [])

  const handleDatatableFetchData = useCallback((...params) => {
    onFetchData && onFetchData(...params);
  }, []);

  const handleSelectedRowsChange = useCallback((selectedRows) => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRows.map(s => s.original));
  }, [onSelectedRowsChange]);

  return (
    <LoadingIndicator loading={loading} mount={false}>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={accounts}
        onFetchData={handleDatatableFetchData}
        manualSortBy={true}
        selectionColumn={selectionColumn}
        expandable={true} 
        treeGraph={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        loading={accountsLoading && !initialMount}
        spinnerProps={{size: 30}} />
    </LoadingIndicator>
  );
}

export default compose(
  DialogConnect,
  withDashboardActions,
  withAccountsActions,
  withAccounts(({ accountsLoading, accounts }) => ({
    accountsLoading,
    accounts,
  })),
)(AccountsDataTable);
