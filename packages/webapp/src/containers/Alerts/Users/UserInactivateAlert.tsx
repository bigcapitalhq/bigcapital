import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useInactivateUser } from '@/hooks/query';
import { compose } from '@/utils';

interface UserInactivateAlertPayload {
  userId: number;
}

interface UserInactivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: UserInactivateAlertPayload;
}

interface UserInactivateError {
  type: string;
}

/**
 * User inactivate alert.
 */
function UserInactivateAlertInner({
  name,
  isOpen,
  payload: { userId },
  closeAlert,
}: UserInactivateAlertProps): React.ReactElement {
  const { mutateAsync: userInactivateMutate, isPending: isLoading } =
    useInactivateUser();

  const handleConfirmInactivate = () => {
    userInactivateMutate(userId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_user_has_been_inactivated_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({ data: { errors } }: { data: { errors: UserInactivateError[] } }) => {
          if (
            errors.find(
              (e) => e.type === 'CANNOT.TOGGLE.ACTIVATE.AUTHORIZED.USER',
            )
          ) {
            AppToaster.show({
              message:
                'You could not activate/inactivate the same authorized user.',
              intent: Intent.DANGER,
            });
          }
        },
      )
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
      confirmButtonText={intl.get('inactivate')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmInactivate}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_inactive_this_account'} />
      </p>
    </Alert>
  );
}

export const UserInactivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(UserInactivateAlertInner);
