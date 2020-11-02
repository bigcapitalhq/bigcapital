import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { queryCache, useQuery } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withUsers from 'containers/Users/withUsers';
import UsersDataTable from './UsersDataTable';
import withUsersActions from 'containers/Users/withUsersActions';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { snakeCase } from 'lodash';

import AppToaster from 'components/AppToaster';

import { compose } from 'utils';

function UsersListPreferences({
  // #withDialog
  openDialog,

  // #withDashboardActions
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
  const [selectedRows, setSelectedRows] = useState([]);

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

  // const handelDataTableFetchData = useCallback(() => {
  //   onFetchData && onFetchData();
  // }, [onFetchData]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (accounts) => {
      setSelectedRows(accounts);
    },
    [setSelectedRows],
  );

  return (
    <DashboardInsider loading={fetchUsers.isFetching}>
      <DashboardPageContent>
        <UsersDataTable
          onDeleteUser={handleDeleteUser}
          onInactiveUser={handleInactiveUser}
          onEditUser={handleEditUser}
          // onFetchData={handleFetchData}
          onSelectedRowsChange={handleSelectedRowsChange}
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
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDialogActions,
  withDashboardActions,
  withUsersActions,
)(UsersListPreferences);
