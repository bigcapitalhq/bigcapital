import React, { useEffect, useCallback, useState, useMemo } from 'react';
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
import { useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import { compose } from 'utils';
import AccountsConnect from 'connectors/Accounts.connector';
import DialogConnect from 'connectors/Dialog.connector';
import DashboardConnect from 'connectors/Dashboard.connector';
import ViewConnect from 'connectors/View.connector';
import LoadingIndicator from 'components/LoadingIndicator';
import DataTable from 'components/DataTable';
import Money from 'components/Money';
import { useUpdateEffect } from 'hooks';


function AccountsDataTable({
  loading,
  accounts,
  onDeleteAccount,
  onInactiveAccount,
  openDialog,
  changeCurrentView,
  changePageSubtitle,
  getViewItem,
  setTopbarEditView,
  accountsLoading,
  onFetchData,
  onSelectedRowsChange
}) {
  const [initialMount, setInitialMount] = useState(false);

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
      <MenuItem text='View Details' />
      <MenuDivider />
      <MenuItem
        text='Edit Account'
        onClick={handleEditAccount(account)} />
      <MenuItem
        text='New Account'
        onClick={() => handleNewParentAccount(account)} />
      <MenuDivider />
      <MenuItem
        text='Inactivate Account'
        onClick={() => onInactiveAccount(account)} />
      <MenuItem
        text='Delete Account'
        onClick={() => onDeleteAccount(account)} />
    </Menu>
  ), [handleEditAccount, onDeleteAccount, onInactiveAccount]);

  const columns = useMemo(() => [
    {
      id: 'name',
      Header: 'Account Name',
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
      Header: 'Code',
      accessor: 'code',
      className: 'code',
      width: 100,
    },
    {
      id: 'type',
      Header: 'Type',
      accessor: 'type.name',
      className: 'type',
      width: 120,
    },
    {
      id: 'normal',
      Header: 'Normal',
      Cell: ({ cell }) => {
        const account = cell.row.original;
        const type = account.type ? account.type.normal : '';
        const arrowDirection = type === 'credit' ? 'down' : 'up';

        return (<Icon icon={`arrow-${arrowDirection}`} />);
      },
      className: 'normal',
      width: 75,
    },
    {
      id: 'balance',
      Header: 'Balance',
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
  ], [actionMenuList]);

  const selectionColumn = useMemo(() => ({
    minWidth: 42,
    width: 42,
    maxWidth: 42,
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
  AccountsConnect,
  DialogConnect,
  DashboardConnect,
  ViewConnect
)(AccountsDataTable);
