// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';

import { useDeleteUser } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * User delete alert.
 */
function UserDeleteAlert({
  // #ownProps
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { userId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: deleteUserMutate, isLoading } = useDeleteUser();

  const handleCancelUserDelete = () => {
    closeAlert(name);
  };

  const handleConfirmUserDelete = () => {
    deleteUserMutate(userId)
      .then((response) => {
        AppToaster.show({
          message: intl.get('the_user_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          if (errors.find((e) => e.type === 'CANNOT_DELETE_LAST_USER')) {
            AppToaster.show({
              message: 'Cannot delete the last user in the system.',
              intent: Intent.DANGER,
            });
          }
          closeAlert(name);
        },
      );
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelUserDelete}
      onConfirm={handleConfirmUserDelete}
      loading={isLoading}
    >
      <p>
        Once you delete this user, you won't be able to restore it later. Are
        you sure you want to delete ?
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(UserDeleteAlert);
