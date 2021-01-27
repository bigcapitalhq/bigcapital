import React, { useState } from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import { handleDeleteErrors } from 'containers/Accounts/utils';

import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Account delete alerts.
 */
function AccountDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { accountId },

  // #withAccountsActions
  requestDeleteAccount,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // handle cancel delete account alert.
  const handleCancelAccountDelete = () => {
    closeAlert(name);
  };

  // Handle confirm account delete.
  const handleConfirmAccountDelete = () => {
    setLoading(true);
    requestDeleteAccount(accountId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_account_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('accounts-table');
      })
      .catch((errors) => {
        handleDeleteErrors(errors);
      })
      .finally(() => {
        setLoading(false);
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelAccountDelete}
      onConfirm={handleConfirmAccountDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_account_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withAccountsActions,
)(AccountDeleteAlert);
