// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Alert, Intent } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';
import { useActivateUser } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * User inactivate alert.
 */
function UserActivateAlert({
  // #ownProps
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { userId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: userActivateMutate } = useActivateUser();

  const handleConfirmActivate = () => {
    userActivateMutate(userId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_user_has_been_activated_successfully'),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch((error) => {
        closeAlert(name);
      });
  };

  const handleCancel = () => {
    closeAlert(name);
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'activate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmActivate}
    >
      <p>
        <T id={'are_sure_to_activate_this_account'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(UserActivateAlert);
