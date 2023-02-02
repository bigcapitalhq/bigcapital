// @ts-nocheck
import React, { useState } from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import withAccountsActions from '@/containers/Accounts/withAccountsTableActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

function AccountBulkInactivateAlert({
  name,
  isOpen,
  payload: { accountsIds },

  // #withAccountsActions
  requestBulkInactiveAccounts,

  closeAlert,
}) {
  
  const [isLoading, setLoading] = useState(false);
  const selectedRowsCount = 0;

  // Handle alert cancel.
  const handleCancel = () => {
    closeAlert(name);
  };
  // Handle Bulk Inactive accounts confirm.
  const handleConfirmBulkInactive = () => {
    setLoading(true);
    requestBulkInactiveAccounts(accountsIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_accounts_have_been_successfully_inactivated'),
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
      confirmButtonText={`${intl.get('inactivate')} (${selectedRowsCount})`}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkInactive}
      loading={isLoading}
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
