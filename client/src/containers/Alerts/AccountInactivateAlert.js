import React, { useState } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';

import { compose } from 'utils';

function AccountInactivateAlert({
  name,
  isOpen,
  payload: { accountId },

  // #withAlertActions
  closeAlert,

  // #withAccountsActions
  requestInactiveAccount,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  const handleCancelInactiveAccount = () => {
    closeAlert('account-inactivate');
  };

  const handleConfirmAccountActive = () => {
    setLoading(true);
    requestInactiveAccount(accountId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_account_has_been_successfully_inactivated',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('accounts-table');
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
        closeAlert('account-inactivate');
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'inactivate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelInactiveAccount}
      onConfirm={handleConfirmAccountActive}
      loading={isLoading}
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
  withAccountsActions,
)(AccountInactivateAlert);
