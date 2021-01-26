import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

function AccountBulkInactivateAlert({
  name,
  isOpen,
  payload: { accountsIds },

  // #withAccountsActions
  requestBulkInactiveAccounts,

  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const selectedRowsCount = 0;

  // Handle alert cancel.
  const handleCancel = () => {
    closeAlert(name);
  };
  // Handle Bulk Inactive accounts confirm.
  const handleConfirmBulkInactive = () => {
    requestBulkInactiveAccounts(accountsIds)
      .then(() => {
        closeAlert(name);

        AppToaster.show({
          message: formatMessage({
            id: 'the_accounts_have_been_successfully_inactivated',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('accounts-table');
      })
      .catch((errors) => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={`${formatMessage({
        id: 'inactivate',
      })} (${selectedRowsCount})`}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkInactive}
    >
      <p>
        <T id={'are_sure_to_inactive_this_accounts'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withAccountsActions,
)(AccountBulkInactivateAlert);
