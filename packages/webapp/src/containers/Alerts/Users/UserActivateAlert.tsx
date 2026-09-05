import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useActivateUser } from '@/hooks/query';
import { compose } from '@/utils';

interface UserActivateAlertPayload {
  userId: number;
}

interface UserActivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: UserActivateAlertPayload;
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
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck silently closed the alert on error without surfacing the failure.
        AppToaster.show({
          message: error.message,
          intent: Intent.DANGER,
        });
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

export const UserActivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(UserActivateAlertInner);
