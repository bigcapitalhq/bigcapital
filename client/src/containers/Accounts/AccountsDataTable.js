import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  Button,
  Popover,
  Position,
} from '@blueprintjs/core';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { Icon, DataTable, If } from 'components';
import { saveInvoke, compose } from 'utils';
import { useUpdateEffect } from 'hooks';

import { CLASSES } from 'common/classes';

import { NormalCell, BalanceCell, AccountActionsMenuList } from './components';
import { TableFastCell } from 'components';
import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccounts from 'containers/Accounts/withAccounts';
import withCurrentView from 'containers/Views/withCurrentView';

/**
 * Accounts data-table.
 */
function AccountsDataTable({
  // #withDashboardActions
  accountsTable,
  accountsLoading,

  // #
  currentViewId,

  // #ownProps
  onFetchData,
  onSelectedRowsChange,
  onDeleteAccount,
  onInactivateAccount,
  onActivateAccount,
  onEditAccount,
  onNewChildAccount
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


  const ActionsCell = useMemo(() => 
    ({ row }) => (
      <Popover
        content={<AccountActionsMenuList
          account={row.original}
          onDeleteAccount={onDeleteAccount}
          onInactivateAccount={onInactivateAccount}
          onActivateAccount={onActivateAccount}
          onEditAccount={onEditAccount}
        />}
        position={Position.RIGHT_TOP}
      >
        <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
      </Popover>
  ), [
    onDeleteAccount,
    onInactivateAccount,
    onActivateAccount,
    onEditAccount
  ]);

  const RowContextMenu = useMemo(() => ({ row }) => (
    <AccountActionsMenuList
      account={row.original}
      onDeleteAccount={onDeleteAccount}
      onInactivateAccount={onInactivateAccount}
      onActivateAccount={onActivateAccount}
      onEditAccount={onEditAccount}
      onNewChildAccount={onNewChildAccount}
    />
  ), [
    onDeleteAccount,
    onInactivateAccount,
    onActivateAccount,
    onEditAccount,
    onNewChildAccount
  ]);

  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'name',
        className: 'account_name',
        width: 200,
      },
      {
        id: 'code',
        Header: formatMessage({ id: 'code' }),
        accessor: 'code',
        className: 'code',
        width: 80,
      },
      {
        id: 'type',
        Header: formatMessage({ id: 'type' }),
        accessor: 'account_type_label',
        className: 'type',
        width: 140,
      },
      {
        id: 'normal',
        Header: formatMessage({ id: 'normal' }),
        Cell: NormalCell,
        accessor: 'account_normal',
        className: 'normal',
        width: 80,
      },
      {
        id: 'currency',
        Header: formatMessage({ id: 'currency' }),
        accessor: (row) => 'USD',
        width: 75,
      },
      {
        id: 'balance',
        Header: formatMessage({ id: 'balance' }),
        accessor: 'amount',
        Cell: BalanceCell,
        width: 150,
      },
      {
        id: 'actions',
        Header: '',
        Cell: ActionsCell,
        className: 'actions',
        width: 50,
      },
    ],
    [ActionsCell, formatMessage],
  );

  const handleDatatableFetchData = useCallback(
    (...params) => {
      saveInvoke(onFetchData, params);
    },
    [onFetchData],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      saveInvoke(onSelectedRowsChange, selectedRows);
    },
    [onSelectedRowsChange],
  );

  const rowClassNames = (row) => ({
    inactive: !row.original.active,
  });

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={accountsTable}
        onFetchData={handleDatatableFetchData}
        selectionColumn={true}
        expandable={true}
        sticky={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        loading={accountsLoading && !isMounted}
        rowContextMenu={RowContextMenu}
        rowClassNames={rowClassNames}
        autoResetExpanded={false}
        autoResetSortBy={false}
        autoResetSelectedRows={false}
        expandColumnSpace={1}
        expandToggleColumn={2}
        selectionColumnWidth={50}
        TableCellRenderer={TableFastCell}
        TableRowsRenderer={TableVirtualizedListRows}
        // #TableVirtualizedListRows props.
        vListrowHeight={42}
        vListOverscanRowCount={10}
      />
    </div>
  );
}

export default compose(
  withRouter,
  withCurrentView,
  withDashboardActions,
  withAccountsActions,
  withAccounts(({ accountsLoading, accountsTable }) => ({
    accountsLoading,
    accountsTable,
  })),
)(AccountsDataTable);
