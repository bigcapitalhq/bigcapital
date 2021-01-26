import React from 'react';
import {
  FormattedMessage as T,
  useIntl
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import { handleDeleteErrors } from 'containers/Accounts/utils';

import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

function AccountBulkDeleteAlert({
  // #ownProps
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { accountsIds },

  // #withAlertActions
  closeAlert,

  // #withAccountsActions
  requestDeleteBulkAccounts
}) {
  const { formatMessage } = useIntl();
  const selectedRowsCount = 0;

  const handleCancel = () => {
    closeAlert(name);
  };
  // Handle confirm accounts bulk delete.
  const handleConfirmBulkDelete = () => {
    requestDeleteBulkAccounts(accountsIds)
      .then(() => {
        closeAlert(name);
        AppToaster.show({
          message: formatMessage({
            id: 'the_accounts_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('accounts-table');
      })
      .catch((errors) => {
        closeAlert(name);
        handleDeleteErrors(errors);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={`${formatMessage({
        id: 'delete',
      })} (${selectedRowsCount})`}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkDelete}
    >
      <p>
        <T id={'once_delete_these_accounts_you_will_not_able_restore_them'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withAccountsActions
)(AccountBulkDeleteAlert);