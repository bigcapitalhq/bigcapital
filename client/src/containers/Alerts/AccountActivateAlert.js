import React from 'react';
import {
  FormattedMessage as T,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';

import { compose } from 'utils';

/**
 * Account activate alert.
 */
function AccountActivateAlert({
  name,
  isOpen,
  payload: { accountId },

  // #withAlertActions
  closeAlert,

  requestActivateAccount
}) {
  const { formatMessage } = useIntl();

  // Handle alert cancel.
  const handleCancel = () => {
    closeAlert('account-activate');
  };

  // Handle activate account confirm.
  const handleConfirmAccountActivate = () => {
    requestActivateAccount(accountId)
      .then(() => {
        closeAlert('account-activate');
        AppToaster.show({
          message: formatMessage({
            id: 'the_account_has_been_successfully_activated',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('accounts-table');
      })
      .catch((error) => {
        closeAlert('account-activate');
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'activate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmAccountActivate}
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
  withAccountsActions
)(AccountActivateAlert);
