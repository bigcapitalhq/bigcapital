import React, { useState, useCallback, useEffect } from 'react';
import { queryCache, useQuery } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withUsersActions from 'containers/Users/withUsersActions';

import UsersDataTable from './UsersDataTable';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import AppToaster from 'components/AppToaster';

import { compose } from 'utils';

function UsersListPreferences({
  // #withDashboardActions
  changePreferencesPageTitle,

  // #withUsersActions
  requestDeleteUser,
  requestInactiveUser,
  requestFetchUsers,
}) {
  const [deleteUserState, setDeleteUserState] = useState(false);
  const [inactiveUserState, setInactiveUserState] = useState(false);

  const { formatMessage } = useIntl();

  const fetchUsers = useQuery('users-table', () => requestFetchUsers());

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'users' }));
  }, [changePreferencesPageTitle, formatMessage]);

  // Handle cancel/confirm user inactive.
  const handleInactiveUser = useCallback((user) => {
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

  // Handle click and cancel/confirm user delete
  const handleDeleteUser = useCallback((user) => {
    setDeleteUserState(user);
  }, []);

  // handle cancel delete user alert.
  const handleCancelUserDelete = () => {
    setDeleteUserState(false);
  };

  const handleEditUser = useCallback(() => {}, []);

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


  return (
    <>
      <UsersDataTable
        loading={fetchUsers.isFetching}
        onDeleteUser={handleDeleteUser}
        onInactiveUser={handleInactiveUser}
        onEditUser={handleEditUser}
      />
      <Alert
        cancelButtonText={<T id={'cancel'} />}
        confirmButtonText={<T id={'delete'} />}
        intent={Intent.DANGER}
        isOpen={deleteUserState}
        onCancel={handleCancelUserDelete}
        onConfirm={handleConfirmUserDelete}
      >
        <p>
          Once you delete this user, you won't be able to restore it later. Are you sure you want to delete ?
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
    </>
  );
}

export default compose(
  withDashboardActions,
  withUsersActions,
)(UsersListPreferences);
