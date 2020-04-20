import React, { useState, useMemo, useCallback } from 'react';
import { useAsync } from 'react-use';
import DataTable from 'components/DataTable';
import {
  Alert,
  Popover,
  Button,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Intent,
} from '@blueprintjs/core';
import Icon from 'components/Icon';
import LoadingIndicator from 'components/LoadingIndicator';
import { snakeCase } from 'lodash';
import UserListConnect from 'connectors/UsersList.connector';
import AppToaster from 'components/AppToaster';
import { compose } from 'utils';
import DialogConnect from 'connectors/Dialog.connector';
import DashboardConnect from 'connectors/Dashboard.connector';

function UsersListPreferences({
  fetchUsers,
  usersList,
  openDialog,
  closeDialog,
  deleteUser,
  onFetchData,
}) {
  const [deleteUserState, setDeleteUserState] = useState(false);
  const [inactiveUserState, setInactiveUserState] = useState(false);

  const asyncHook = useAsync(async () => {
    await Promise.all([fetchUsers()]);
  }, []);

  const onInactiveUser = (user) => {};

  const onDeleteUser = (user) => {
    setDeleteUserState(user);
  };
  const handleCancelUserDelete = () => {
    setDeleteUserState(false);
  };

  const onEditUser = (user) => () => {
    const form = Object.keys(user).reduce((obj, key) => {
      const camelKey = snakeCase(key);
      obj[camelKey] = user[key];
      return obj;
    }, {});

    openDialog('user-form', { action: 'edit', user: form });
  };

  const handleConfirmUserDelete = () => {
    if (!deleteUserState) {
      return;
    }

    deleteUser(deleteUserState.id).then((response) => {
      setDeleteUserState(false);
      AppToaster.show({
        message: 'the_user_has_been_deleted',
      });
    });
  };

  const actionMenuList = (user) => (
    <Menu>
      <MenuItem text='Edit User' onClick={onEditUser(user)} />
      <MenuItem text='New Account' />
      <MenuDivider />
      <MenuItem text='Inactivate User' onClick={() => onInactiveUser(user)} />
      <MenuItem text='Delete User' onClick={() => onDeleteUser(user)} />
    </Menu>
  );
  console.log(usersList, 'X');

  const columns = useMemo(
    () => [
      {
        id: 'full_name',
        Header: 'Full Name',
        accessor: 'full_name',
        width: 170,
      },
      {
        id: 'email',
        Header: 'Email',
        accessor: 'email',
        width: 150,
      },
      {
        id: 'phone_number',
        Header: 'Phone Number',
        accessor: 'phone_number',
        width: 150,
      },
      {
        id: 'active',
        Header: 'Status',
        accessor: (user) =>
          user.active ? <span>Active</span> : <span>Inactivate</span>,
        width: 50,
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_TOP}
          >
            <Button icon={<Icon icon='ellipsis-h' />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
      },
    ],
    [actionMenuList]
  );

  const handelDataTableFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, []);

  return (
    <LoadingIndicator>
      <DataTable
        columns={columns}
        data={usersList}
        onFetchData={handelDataTableFetchData()}
        manualSortBy={true}
        expandable={false}
      />

      <Alert
        cancelButtonText='Cancel'
        confirmButtonText='Move to Trash'
        icon='trash'
        intent={Intent.DANGER}
        isOpen={deleteUserState}
        onCancel={handleCancelUserDelete}
        onConfirm={handleConfirmUserDelete}
      >
        <p>
          Are you sure you want to move <b>filename</b> to Trash? You will be
          able to restore it later, but it will become private to you.
        </p>
      </Alert>
    </LoadingIndicator>
  );
}

export default compose(
  UserListConnect,
  DialogConnect,
  DashboardConnect
)(UsersListPreferences);
