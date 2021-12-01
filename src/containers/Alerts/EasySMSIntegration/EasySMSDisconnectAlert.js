import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, FormattedHTMLMessage } from 'components';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';

import { useSettingEasySMSDisconnect } from 'hooks/query';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Easy SMS disconnect alert.
 */
function EasySMSDisconnectAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: {},

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: disconnectEasySMS, isLoading } =
    useSettingEasySMSDisconnect();

  // Handle cancel Disconnect alert.
  const handleCancelDisconnect = () => {
    closeAlert(name);
  };

  // Handle confirm Disconnect alert.
  const handleConfirmDisconnect = () => {
    disconnectEasySMS()
      .then(() => {
        AppToaster.show({
          message: intl.get('easysms.disconnect.alert.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'easysms.label.disconnect'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelDisconnect}
      onConfirm={handleConfirmDisconnect}
      loading={isLoading}
    >
      <p>Ea aliqua elit reprehenderit pariatur consequat voluptate quis.</p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(EasySMSDisconnectAlert);
