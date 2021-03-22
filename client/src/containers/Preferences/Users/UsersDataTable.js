import React, { useCallback } from 'react';

import { compose } from 'utils';
import { DataTable } from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertActions from 'containers/Alert/withAlertActions';

import { ActionsMenu, useUsersListColumns } from './components';
import { useUsersListContext } from './UsersProvider';

/**
 * Users datatable.
 */
function UsersDataTable({
  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,
}) {
  // Handle edit user action.
  const handleEditUserAction = useCallback(
    (user) => {
      openDialog('userList-form', { action: 'edit', userId: user.id });
    },
    [openDialog],
  );
  // Handle inactivate user action.
  const handleInactivateUser = useCallback(
    (user) => {
      openAlert('user-inactivate', { userId: user.id });
    },
    [openAlert]
  );
  // Handle activate user action.
  const handleActivateuser = useCallback(
    (user) => {
      openAlert('user-activate', { userId: user.id });
    },
    [openAlert]
  );
  // Handle delete user action.
  const handleDeleteUser = useCallback(
    (user) => {
      openAlert('user-delete', { userId: user.id });
    },
    [openAlert]
  );
  // Users list columns.
  const columns = useUsersListColumns();

  // Users list context.
  const { users, isUsersLoading, isUsersFetching } = useUsersListContext();

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={isUsersLoading}
      headerLoading={isUsersLoading}
      progressBarLoading={isUsersFetching}
      noInitialFetch={true}
      ContextMenu={ActionsMenu}
      payload={{
        onEdit: handleEditUserAction,
        onActivate: handleInactivateUser,
        onInactivate: handleActivateuser,
        onDelete: handleDeleteUser
      }}
    />
  );
}

export default compose(
  withDialogActions,
  withAlertActions
)(UsersDataTable);
