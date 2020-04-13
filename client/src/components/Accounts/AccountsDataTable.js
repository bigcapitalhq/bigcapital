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

  const handleEditAccount = useCallback((account) => () => {
    openDialog('account-form', { action: 'edit', id: account.id });
  }, [openDialog]);

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
      // Build our expander column
      id: 'expander', // Make sure it has an ID
      className: 'expander',
      Header: ({
        getToggleAllRowsExpandedProps,
        isAllRowsExpanded
      }) => (
        <span {...getToggleAllRowsExpandedProps()} className="toggle">
          {isAllRowsExpanded ?
            (<span class="arrow-down" />) :
            (<span class="arrow-right" />)
          }
        </span>
      ),
      Cell: ({ row }) =>
        // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
        // to build the toggle for expanding a row
        row.canExpand ? (
          <span
            {...row.getToggleRowExpandedProps({
              style: {
                // We can even use the row.depth property
                // and paddingLeft to indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              },
              className: 'toggle',
            })}
          >
            {row.isExpanded ?
              (<span class="arrow-down" />) :
              (<span class="arrow-right" />)
            }
          </span>
        ) : null,
      width: 20,
      disableResizing: true,
    },
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
  ], []);

  const selectionColumn = useMemo(() => ({
    minWidth: 42,
    width: 42,
    maxWidth: 42,
  }), [])

  const handleDatatableFetchData = useCallback((...params) => {
    onFetchData && onFetchData(...params);
  }, []);

  return (
    <LoadingIndicator loading={accountsLoading} spinnerSize={30}>
      <DataTable
        columns={columns}
        data={accounts}
        onFetchData={handleDatatableFetchData}
        manualSortBy={true}
        selectionColumn={selectionColumn} />
    </LoadingIndicator>    
  );
}

export default compose(
  AccountsConnect,
  DialogConnect,
  DashboardConnect,
  ViewConnect
)(AccountsDataTable);
