import React, { useCallback, useState, useMemo } from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuDivider,
  Tag,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { withRouter } from 'react-router';
import { snakeCase } from 'lodash';

import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { compose } from 'utils';
import LoadingIndicator from 'components/LoadingIndicator';
import { DataTable, Icon, If, AppToaster } from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withUsers from 'containers/Users/withUsers';

function UsersDataTable({
  // #withDialogActions
  openDialog,

  // #withUsers
  usersList,
  usersLoading,

  // #ownProps
  loading,
  onFetchData,
  onInactiveUser,
  onDeleteUser,
  onSelectedRowsChange,
}) {
  const [initialMount, setInitialMount] = useState(false);
  const { formatMessage } = useIntl();

  const onEditUser = useCallback(
    (user) => () => {
      const form = Object.keys(user).reduce((obj, key) => {
        const camelKey = snakeCase(key);
        obj[camelKey] = user[key];
        return obj;
      }, {});

      openDialog('userList-form', { action: 'edit', user: form });
    },
    [openDialog],
  );

  const actionMenuList = useCallback(
    (user) => (
      <Menu>
        <If condition={user.invite_accepted_at}>
          <MenuItem
            icon={<Icon icon="pen-18" />}
            text={formatMessage({ id: 'edit_user' })}
            onClick={onEditUser(user)}
          />
          <MenuDivider />

          <MenuItem
            text={formatMessage({ id: 'inactivate_user' })}
            onClick={() => onInactiveUser(user)}
          />
        </If>

        <MenuItem
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={formatMessage({ id: 'delete_user' })}
          onClick={() => onDeleteUser(user)}
          intent={Intent.DANGER}
        />
      </Menu>
    ),
    [onInactiveUser, onDeleteUser, onEditUser],
  );
  const onRowContextMenu = useCallback(
    (cell) => {
      return actionMenuList(cell.row.original);
    },
    [actionMenuList],
  );

  const columns = useMemo(
    () => [
      {
        id: 'full_name',
        Header: formatMessage({ id: 'full_name' }),
        accessor: 'full_name',
        width: 150,
      },
      {
        id: 'email',
        Header: formatMessage({ id: 'email' }),
        accessor: 'email',
        width: 150,
      },
      {
        id: 'phone_number',
        Header: formatMessage({ id: 'phone_number' }),
        accessor: 'phone_number',
        width: 120,
      },
      {
        id: 'status',
        Header: 'Status',
        accessor: (user) =>
          !user.invite_accepted_at ? (
            <Tag minimal={true}>
              <T id={'inviting'} />
            </Tag>
          ) : user.active ? (
            <Tag intent={Intent.SUCCESS} minimal={true}>
              <T id={'activate'} />
            </Tag>
          ) : (
            <Tag intent={Intent.WARNING} minimal={true}>
              <T id={'inactivate'} />
            </Tag>
          ),
        width: 80,
        className: 'status',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_BOTTOM}
          >
            <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const handelDataTableFetchData = useCallback(
    (...args) => {
      onFetchData && onFetchData(...args);
    },
    [onFetchData],
  );
  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );

  return (
    <LoadingIndicator loading={loading} mount={false}>
      <DataTable
        columns={columns}
        data={usersList}
        onFetchData={handelDataTableFetchData}
        loading={usersLoading && !initialMount}
        manualSortBy={true}
        noInitialFetch={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        rowContextMenu={onRowContextMenu}
      />
    </LoadingIndicator>
  );
}

export default compose(
  withRouter,
  withDialogActions,
  withUsers(({ usersList, usersLoading }) => ({ usersList, usersLoading })),
)(UsersDataTable);
