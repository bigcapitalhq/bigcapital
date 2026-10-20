import { USERS_ERROR_TYPES } from '@bigcapital/sdk-ts';
import { Alert, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useActivateUser } from '@/hooks/query';

interface UserActivateAlertPayload {
  userId: number;
}

interface UserActivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: UserActivateAlertPayload;
}

interface UserActivateError {
  type: string;
}

interface UserActivateErrorResponse {
  data: { errors?: UserActivateError[] };
}

/**
 * User activate alert.
 */
function UserActivateAlertInner({
  name,
  isOpen,
  payload: { userId },
  closeAlert,
}: UserActivateAlertProps): React.ReactElement {
  const { mutateAsync: userActivateMutate, isPending: isLoading } =
    useActivateUser();

  const handleConfirmActivate = () => {
    userActivateMutate(userId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_user_has_been_activated_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: UserActivateErrorResponse) => {
        const errors = error?.data?.errors ?? [];
        if (
          errors.find(
            (e) => e.type === USERS_ERROR_TYPES.UserSameTheAuthorizedUser,
          )
        ) {
          AppToaster.show({
            message: intl.get('cannot_toggle_authorized_user'),
            intent: Intent.DANGER,
          });
        }
        if (
          errors.find((e) => e.type === USERS_ERROR_TYPES.UserAlreadyActive)
        ) {
          AppToaster.show({
            message: intl.get('user_is_already_active'),
            intent: Intent.WARNING,
          });
        }
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  const handleCancel = () => {
    closeAlert(name);
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('activate')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmActivate}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_activate_this_account'} />
      </p>
    </Alert>
  );
}

export const UserActivateAlert = FF.pipe(
  UserActivateAlertInner,
  withAlertActions,
  withAlertStoreConnect(),
);
