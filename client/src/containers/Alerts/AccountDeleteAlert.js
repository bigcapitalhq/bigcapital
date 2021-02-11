import React from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';

import { handleDeleteErrors } from 'containers/Accounts/utils';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { useDeleteAccount } from 'hooks/query';
import { compose } from 'utils';

/**
 * Account delete alerts.
 */
function AccountDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { accountId },

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const { isLoading, mutateAsync: deleteAccount } = useDeleteAccount();

  // handle cancel delete account alert.
  const handleCancelAccountDelete = () => {
    closeAlert(name);
  };
  // Handle confirm account delete.
  const handleConfirmAccountDelete = () => {
    deleteAccount(accountId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_account_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch(({ response: { data: { errors } } }) => {
        handleDeleteErrors(errors);
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
)(AccountDeleteAlert);
