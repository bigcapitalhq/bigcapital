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
import classNames from 'classnames';
import { Icon, DataTable, Money, If, Choose } from 'components';
import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';

import { CLASSES } from 'common/classes';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccounts from 'containers/Accounts/withAccounts';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withCurrentView from 'containers/Views/withCurrentView';



function NormalCell({ cell }) {
  const { formatMessage } = useIntl();

  const account = cell.row.original;
  const normal = account?.type?.normal || '';
  const arrowDirection = normal === 'credit' ? 'down' : 'up';

  return (
    <Tooltip
      className={Classes.TOOLTIP_INDICATOR}
      content={formatMessage({ id: normal })}
      position={Position.RIGHT}
      hoverOpenDelay={100}
    >
      <Icon icon={`arrow-${arrowDirection}`} />
    </Tooltip>
  );
}

function BalanceCell({ cell }) {
  const account = cell.row.original;

  return account.amount ? (
    <span>
      <Money amount={account.amount} currency={'USD'} />
    </span>
  ) : (
    <span class="placeholder">—</span>
  );
}

function InactiveSemafro() {
  return (
    <Tooltip
      content={<T id="inactive" />}
      className={classNames(
        Classes.TOOLTIP_INDICATOR,
        'bp3-popover-wrapper--inactive-semafro',
      )}
      position={Position.TOP}
      hoverOpenDelay={250}
    >
      <div className="inactive-semafro"></div>
    </Tooltip>
  );
}

function AccountNameAccessor(row) {
  return (
    <>
      <Choose>
        <Choose.When condition={!!row.description}>
          <Tooltip
            className={classNames(
              Classes.TOOLTIP_INDICATOR,
              'bp3-popover-wrapper--account-desc',
            )}
            content={row.description}
            position={Position.RIGHT_TOP}
            hoverOpenDelay={500}
          >
            {row.name}
          </Tooltip>
        </Choose.When>

        <Choose.Otherwise>{row.name}</Choose.Otherwise>
      </Choose>

      <If condition={!row.active}>
        <InactiveSemafro />
      </If>
    </>
  );
}

function AccountsDataTable({
  // #withDashboardActions
  accountsTable,
  accountsLoading,

  // #withDialog.
  openDialog,

  currentViewId,

  // own properties
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
      });
    },
    [openDialog],
  );

  const actionMenuList = useCallback(
    (account) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_account' })}
          onClick={handleEditAccount(account)}
        />
        <MenuItem
          icon={<Icon icon="plus" />}
          text={formatMessage({ id: 'new_child_account' })}
          onClick={() => handleNewParentAccount(account)}
        />
        <MenuDivider />
        <If condition={account.active}>
          <MenuItem
            text={formatMessage({ id: 'inactivate_account' })}
            icon={<Icon icon="pause-16" iconSize={16} />}
            onClick={() => onInactiveAccount(account)}
          />
        </If>
        <If condition={!account.active}>
          <MenuItem
            text={formatMessage({ id: 'activate_account' })}
            icon={<Icon icon="play-16" iconSize={16} />}
            onClick={() => onActivateAccount(account)}
          />
        </If>
        <MenuItem
          text={formatMessage({ id: 'delete_account' })}
          icon={<Icon icon="trash-16" iconSize={16} />}
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
        accessor: AccountNameAccessor,
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
        accessor: 'type.label',
        className: 'type',
        width: 140,
      },
      {
        id: 'normal',
        Header: formatMessage({ id: 'normal' }),
        Cell: NormalCell,
        accessor: 'type.normal',
        className: 'normal',
        width: 115,
      },
      {
        id: 'currency',
        Header: formatMessage({ id: 'currency' }),
        accessor: (row) => 'USD',
        width: 100,
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
    () => ({ minWidth: 40, width: 40, maxWidth: 40 }),
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
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={accountsTable}
        onFetchData={handleDatatableFetchData}
        manualSortBy={true}
        selectionColumn={selectionColumn}
        expandable={true}
        sticky={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        loading={accountsLoading && !isMounted}
        rowContextMenu={rowContextMenu}
        expandColumnSpace={1}
      />
    </div>
  );
}

export default compose(
  withRouter,
  withCurrentView,
  withDialogActions,
  withDashboardActions,
  withAccountsActions,
  withAccounts(({ accountsLoading, accountsTable }) => ({
    accountsLoading,
    accountsTable,
  })),
)(AccountsDataTable);
