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
  requestFetchUsers,
  usersList,
  openDialog,
  closeDialog,
  requestDeleteUser,
  requestInactiveUser,
  onFetchData,
}) {
  const [deleteUserState, setDeleteUserState] = useState(false);
  const [inactiveUserState, setInactiveUserState] = useState(false);

  const asyncHook = useAsync(async () => {
    await Promise.all([requestFetchUsers()]);
  }, []);

  const onInactiveUser = (user) => {
    setInactiveUserState(user);
  };
  
  // Handle cancel inactive user alert
  const handleCancelInactiveUser = useCallback(() => {
    setInactiveUserState(false);
  }, []);

  // handel confirm user activation
  const handleConfirmUserActive = useCallback(() => {
    requestInactiveUser(inactiveUserState.id).then(() => {
      setInactiveUserState(false);
      requestFetchUsers();
      AppToaster.show({ message: 'the_user_has_been_inactivated' });
    });
  }, [inactiveUserState, requestInactiveUser, requestFetchUsers]);

  const onDeleteUser = (user) => {
    setDeleteUserState(user);
  };

  const handleCancelUserDelete = () => {
    setDeleteUserState(false);
  };

  const onEditInviteUser = (user) => () => {
    const form = Object.keys(user).reduce((obj, key) => {
      const camelKey = snakeCase(key);
      obj[camelKey] = user[key];
      return obj;
    }, {});

    openDialog('user-form', { action: 'edit', user: form });
  };

  const onEditUser = (user) => () => {
    const form = Object.keys(user).reduce((obj, key) => {
      const camelKey = snakeCase(key);
      obj[camelKey] = user[key];
      return obj;
    }, {});

    openDialog('userList-form', { action: 'edit', user: form });
  };

  const handleConfirmUserDelete = () => {
    if (!deleteUserState) { return; }
    requestDeleteUser(deleteUserState.id).then((response) => {
      setDeleteUserState(false);
      AppToaster.show({
        message: 'the_user_has_been_deleted',
      });
    });
  };

  const actionMenuList = useCallback(
    (user) => (
      <Menu>
        <MenuItem text='Edit User' onClick={onEditUser(user)} />
        <MenuDivider />
        <MenuItem text='Edit Invite ' onClick={onEditInviteUser(user)} />
        <MenuItem text='Inactivate User' onClick={() => onInactiveUser(user)} />
        <MenuItem text='Delete User' onClick={() => onDeleteUser(user)} />
      </Menu>
    ),
    []
  );

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

      <Alert
        cancelButtonText='Cancel'
        confirmButtonText='Inactivate'
        icon='trash'
        intent={Intent.WARNING}
        isOpen={inactiveUserState}
        onCancel={handleCancelInactiveUser}
        onConfirm={handleConfirmUserActive}
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
