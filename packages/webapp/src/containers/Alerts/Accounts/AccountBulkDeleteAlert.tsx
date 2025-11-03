// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import { handleDeleteErrors } from '@/containers/Accounts/utils';
import { useBulkDeleteAccounts } from '@/hooks/query/accounts';

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
}) {
  const { mutateAsync: bulkDeleteAccounts, isLoading } = useBulkDeleteAccounts();

  const handleCancel = () => {
    closeAlert(name);
  };
  // Handle confirm accounts bulk delete.
  const handleConfirmBulkDelete = () => {
    bulkDeleteAccounts(accountsIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_accounts_has_been_successfully_deleted'),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('accounts-table');
        closeAlert(name);
      })
      .catch((errors) => {
        handleDeleteErrors(errors);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={
        <T id={'delete_count'} values={{ count: accountsIds?.length || 0 }} />
      }
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
)(AccountBulkDeleteAlert);
