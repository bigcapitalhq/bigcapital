// @ts-nocheck
import React, { useCallback } from 'react';

import { compose } from '@/utils';
import { DataTable, TableSkeletonRows, AppToaster } from '@/components';
import { useResendInvitation } from '@/hooks/query';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { ActionsMenu, useUsersListColumns } from './components';
import { useUsersListContext } from './UsersProvider';
import { Intent } from '@blueprintjs/core';

/**
 * Users datatable.
 */
function UsersDataTable({
  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,
}) {
  const { mutateAsync: resendInvitation } = useResendInvitation();

  // Users list columns.
  const columns = useUsersListColumns();

  // Users list context.
  const { users, isUsersLoading, isUsersFetching } = useUsersListContext();

  // Handle edit user action.
  const handleEditUserAction = useCallback(
    (user) => {
      openDialog('user-form', { action: 'edit', userId: user.id });
    },
    [openDialog],
  );
  // Handle inactivate user action.
  const handleInactivateUser = useCallback(
    (user) => {
      openAlert('user-inactivate', { userId: user.id });
    },
    [openAlert],
  );
  // Handle activate user action.
  const handleActivateuser = useCallback(
    (user) => {
      openAlert('user-activate', { userId: user.id });
    },
    [openAlert],
  );
  // Handle delete user action.
  const handleDeleteUser = useCallback(
    (user) => {
      openAlert('user-delete', { userId: user.id });
    },
    [openAlert],
  );
  const handleResendInvitation = useCallback((user) => {
    resendInvitation(user.id)
      .then(() => {
        AppToaster.show({
          message: 'User invitation has been re-sent to the user.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          if (errors.find((e) => e.type === 'USER_RECENTLY_INVITED')) {
            AppToaster.show({
              message:
                'This person was recently invited. No need to invite them again just yet.',
              intent: Intent.WARNING,
            });
          }
        },
      );
  });

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={isUsersLoading}
      headerLoading={isUsersLoading}
      progressBarLoading={isUsersFetching}
      TableLoadingRenderer={TableSkeletonRows}
      noInitialFetch={true}
      ContextMenu={ActionsMenu}
      payload={{
        onEdit: handleEditUserAction,
        onActivate: handleActivateuser,
        onInactivate: handleInactivateUser,
        onDelete: handleDeleteUser,
        onResendInvitation: handleResendInvitation,
      }}
    />
  );
}

export default compose(withDialogActions, withAlertActions)(UsersDataTable);
