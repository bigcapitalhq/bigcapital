import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { queryCache, useQuery } from 'react-query';
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
  Tag,
} from '@blueprintjs/core';
import { snakeCase } from 'lodash';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import Icon from 'components/Icon';
import LoadingIndicator from 'components/LoadingIndicator';
import { If } from 'components';

import AppToaster from 'components/AppToaster';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withUsers from 'containers/Users/withUsers';
import withUsersActions from 'containers/Users/withUsersActions';

import { compose } from 'utils';


function UsersListPreferences({
  // #withDialog
  openDialog,
  changePreferencesPageTitle,

  // #withUsers
  usersList,

  // #withUsersActions
  requestDeleteUser,
  requestInactiveUser,
  requestFetchUsers,

  // #ownProps
  onFetchData,
}) {
  const [deleteUserState, setDeleteUserState] = useState(false);
  const [inactiveUserState, setInactiveUserState] = useState(false);
  const { formatMessage } = useIntl();
  const fetchUsers = useQuery('users-table', () => requestFetchUsers());

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'users' }));
  }, [changePreferencesPageTitle, formatMessage]);


  const onInactiveUser = useCallback((user) => {
    setInactiveUserState(user);
  }, []);

  // Handle cancel inactive user alert
  const handleCancelInactiveUser = useCallback(() => {
    setInactiveUserState(false);
  }, []);

  // handel confirm user activation
  const handleConfirmUserActive = useCallback(() => {
    requestInactiveUser(inactiveUserState.id)
      .then(() => {
        setInactiveUserState(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_user_has_been_successfully_inactivated',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('users-table');
      })
      .catch((error) => {
        setInactiveUserState(false);
      });
  }, [inactiveUserState, requestInactiveUser, formatMessage]);

  const onDeleteUser = useCallback((user) => {
    setDeleteUserState(user);
  }, []);

  const handleCancelUserDelete = () => {
    setDeleteUserState(false);
  };

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

  // Handle confirm User delete
  const handleConfirmUserDelete = useCallback(() => {
    if (!deleteUserState) {
      return;
    }
    requestDeleteUser(deleteUserState.id)
      .then((response) => {
        setDeleteUserState(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_user_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('users-table');
      })
      .catch((errors) => {
        setDeleteUserState(false);
      });
  }, [deleteUserState, requestDeleteUser, formatMessage]);

  const actionMenuList = useCallback(
    (user) => (
      <Menu>
        <If condition={user.invite_accepted_at}>
          <MenuItem text={<T id={'edit_user'} />} onClick={onEditUser(user)} />
          <MenuDivider />

          <MenuItem
            text={<T id={'inactivate_user'} />}
            onClick={() => onInactiveUser(user)}
          />
        </If>

        <MenuItem
          text={<T id={'delete_user'} />}
          onClick={() => onDeleteUser(user)}
          intent={Intent.DANGER}
        />
      </Menu>
    ),
    [onInactiveUser, onDeleteUser, onEditUser],
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
            position={Position.RIGHT_TOP}
          >
            <Button icon={<Icon icon="ellipsis-h" />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const handelDataTableFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, [onFetchData]);

  return (
    <LoadingIndicator>
      <DataTable
        columns={columns}
        data={usersList}
        onFetchData={handelDataTableFetchData()}
        loading={fetchUsers.isFetching}
        manualSortBy={true}
        expandable={false}
      />

      <Alert
        cancelButtonText={<T id={'cancel'} />}
        confirmButtonText={<T id={'delete'} />}
        icon="trash"
        intent={Intent.DANGER}
        isOpen={deleteUserState}
        onCancel={handleCancelUserDelete}
        onConfirm={handleConfirmUserDelete}
      >
        <p>
          <FormattedHTMLMessage
            id={'once_delete_this_account_you_will_able_to_restore_it'}
          />
        </p>
      </Alert>

      <Alert
        cancelButtonText={<T id={'cancel'} />}
        confirmButtonText={<T id={'inactivate'} />}
        intent={Intent.WARNING}
        isOpen={inactiveUserState}
        onCancel={handleCancelInactiveUser}
        onConfirm={handleConfirmUserActive}
      >
        <p>
          <T id={'are_sure_to_inactive_this_account'} />
        </p>
      </Alert>
    </LoadingIndicator>
  );
}

export default compose(
  withDialogActions,
  withDashboardActions,
  withUsers,
  withUsersActions,
)(UsersListPreferences);
