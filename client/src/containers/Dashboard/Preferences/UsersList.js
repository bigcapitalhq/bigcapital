import React, {useState} from 'react';
import {useAsync} from 'react-use';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
} from '@syncfusion/ej2-react-grids';
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
import {snakeCase} from 'lodash';
import connector from 'connectors/UsersList.connector';
import AppToaster from 'components/AppToaster';

function UsersListPreferences({
  fetchUsers,
  usersList,
  openDialog,
  closeDialog,
  deleteUser,
}) {
  const [deleteUserState, setDeleteUserState] = useState(false);
  const [inactiveUserState, setInactiveUserState] = useState(false);

  const asyncHook = useAsync(async () => {
    await Promise.all([
      fetchUsers(),
    ]);
  }, []);

  const onInactiveUser = (user) => {

  };

  const onDeleteUser = (user) => { setDeleteUserState(user); };
  const handleCancelUserDelete = () => { setDeleteUserState(false); };

  const onEditUser = (user) => () => {
    const form = Object.keys(user).reduce((obj, key) => {
      const camelKey = snakeCase(key);
      obj[camelKey] = user[key];
      return obj;
    }, {});

    openDialog('user-form', { action: 'edit', user: form, });
  };

  const handleConfirmUserDelete = () => {
    if (!deleteUserState) { return; }

    deleteUser(deleteUserState.id).then((response) => {
      setDeleteUserState(false);
      AppToaster.show({
        message: 'the_user_has_been_deleted',
      });
    });
  };

  const actionMenuList = (user) =>
    (<Menu>
      <MenuItem text="Edit User" onClick={onEditUser(user)} />
      <MenuItem text="New Account" />
      <MenuDivider />
      <MenuItem text="Inactivate User" onClick={() => onInactiveUser(user)} />
      <MenuItem text="Delete User" onClick={() => onDeleteUser(user)} />
    </Menu>);

  const columns = [
    {
      field: '',
      headerText: 'Avatar',
    },
    {
      field: 'fullName',
      headerText: 'Full Name',
    },
    {
      field: 'email',
      headerText: 'Email',
    },
    {
      field: 'phoneNumber',
      headerText: 'Phone Number',
    },
    {
      field: '',
      headerText: 'Status',
      template: (user) => user.active
        ? (<span>Active</span>) : (<span>Inactive</span>)
    },
    {
      template: (user) => (
        <Popover content={actionMenuList(user)} position={Position.RIGHT_BOTTOM}>
          <Button icon={<Icon icon="ellipsis-h" />} />
        </Popover>
      ),
    }
  ]
  return (
    <LoadingIndicator loading={asyncHook.loading}>
      <GridComponent
        dataSource={{result: usersList.results}}>

        <ColumnsDirective>
          {columns.map((column) => {
            return (<ColumnDirective
              field={column.field}
              headerText={column.headerText}
              template={column.template}
              allowSorting={true}
              customAttributes={column.customAttributes}
              />);
          })}
        </ColumnsDirective>
      </GridComponent>

      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Move to Trash"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={deleteUserState}
        onCancel={handleCancelUserDelete}
        onConfirm={handleConfirmUserDelete}>
        <p>
        Are you sure you want to move <b>filename</b> to Trash? You will be able to restore it later,
        but it will become private to you.
        </p>
      </Alert>
    </LoadingIndicator>
  );
}

export default connector(UsersListPreferences);