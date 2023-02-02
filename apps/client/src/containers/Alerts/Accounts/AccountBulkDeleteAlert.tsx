// @ts-nocheck
import React, { useState } from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import { handleDeleteErrors } from '@/containers/Accounts/utils';

import withAccountsActions from '@/containers/Accounts/withAccountsActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Account bulk delete alert.
 */
function AccountBulkDeleteAlert({
  // #ownProps
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { accountsIds },

  // #withAlertActions
  closeAlert,

  // #withAccountsActions
  requestDeleteBulkAccounts,
}) {
  
  const [isLoading, setLoading] = useState(false);

  const selectedRowsCount = 0;

  const handleCancel = () => {
    closeAlert(name);
  };
  // Handle confirm accounts bulk delete.
  const handleConfirmBulkDelete = () => {
    setLoading(true);
    requestDeleteBulkAccounts(accountsIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_accounts_has_been_successfully_deleted'),
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
      confirmButtonText={`${intl.get('delete')} (${selectedRowsCount})`}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
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
  withAccountsActions,
)(AccountBulkDeleteAlert);
