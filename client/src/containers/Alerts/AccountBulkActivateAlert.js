import React, { useState } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

function AccountBulkActivateAlert({
  name,
  isOpen,
  payload: { accountsIds },

  // #withAlertActions
  closeAlert,

  requestBulkActivateAccounts,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);
  const selectedRowsCount = 0;

  // Handle alert cancel.
  const handleClose = () => {
    closeAlert(name);
  };

  // Handle Bulk activate account confirm.
  const handleConfirmBulkActivate = () => {
    setLoading(true);
    requestBulkActivateAccounts(accountsIds)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_accounts_has_been_successfully_activated',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('accounts-table');
      })
      .catch((errors) => {})
      .finally(() => {
        setLoading(false);
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={`${formatMessage({
        id: 'activate',
      })} (${selectedRowsCount})`}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleClose}
      onConfirm={handleConfirmBulkActivate}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_activate_this_accounts'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withAccountsActions,
)(AccountBulkActivateAlert);
