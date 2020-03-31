import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
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

function AccountsDataTable({
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
  setSelectedRowsAccounts,
}) {
  const { custom_view_id: customViewId } = useParams();

  useEffect(() => {
    const viewMeta = getViewItem(customViewId);

    if (customViewId) {
      changeCurrentView(customViewId);
      setTopbarEditView(customViewId);
    }
    changePageSubtitle((customViewId && viewMeta) ? viewMeta.name : '');
  }, [customViewId]);

  // Clear page subtitle when unmount the page.
  useEffect(() => () => { changePageSubtitle(''); }, []);

  const handleEditAccount = account => () => {
    openDialog('account-form', { action: 'edit', id: account.id });
  };
  const actionMenuList = account => (
    <Menu>
      <MenuItem text='View Details' />
      <MenuDivider />
      <MenuItem text='Edit Account' onClick={handleEditAccount(account)} />
      <MenuItem text='New Account' />
      <MenuDivider />
      <MenuItem
        text='Inactivate Account'
        onClick={() => onInactiveAccount(account)} />
      <MenuItem
        text='Delete Account'
        onClick={() => onDeleteAccount(account)} />
    </Menu>
  );
  const columns = useMemo(() => [
    {
      id: 'name',
      Header: 'Account Name',
      accessor: 'name',
    },
    {
      id: 'code',
      Header: 'Code',
      accessor: 'code'
    },
    {
      id: 'type',
      Header: 'Type',
      accessor: 'type.name'
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
    },
    {
      id: 'balance',
      Header: 'Balance',
      Cell: ({ cell }) => {
        const account = cell.row.original;
        const {balance} = account;

        return ('undefined' !== typeof balance) ?
          (<span>{ balance.amount }</span>) :
          (<span>--</span>);
      },
      
      // canResize: false,
    },
    {
      id: 'actions',
      Header: '',
      Cell: ({ cell }) => (
        <Popover
          content={actionMenuList(cell.row.original)}
          position={Position.RIGHT_BOTTOM}>
          <Button icon={<Icon icon='ellipsis-h' />} />
        </Popover>
      ),
      className: 'actions',
      width: 50,
      // canResize: false
    }
  ], []);

  const handleDatatableFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, []);

  return (
    <LoadingIndicator loading={accountsLoading} spinnerSize={30}>
      <DataTable
        columns={columns}
        data={accounts}
        onFetchData={handleDatatableFetchData}
        manualSortBy={true}
        selectionColumn={true} />
    </LoadingIndicator>    
  );
}

export default compose(
  AccountsConnect,
  DialogConnect,
  DashboardConnect,
  ViewConnect
)(AccountsDataTable);
