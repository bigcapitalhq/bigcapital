import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Alert, Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { useInactivateUser } from 'hooks/query';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * User inactivate alert.
 */
function UserInactivateAlert({
  // #ownProps
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { userId },

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();

  const { mutateAsync: userInactivateMutate } = useInactivateUser();

  const handleConfirmInactivate = () => {
    userInactivateMutate(userId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_user_has_been_inactivated_successfully',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        
      });
  };

  const handleCancel = () => {
    closeAlert(name);
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'inactivate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmInactivate}
    >
      <p>
        <T id={'are_sure_to_inactive_this_account'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(UserInactivateAlert);
