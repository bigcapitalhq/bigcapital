// @ts-nocheck
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T, AppToaster } from '@/components';

import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withAlertActions } from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';
import { useActivateAccount } from '@/hooks/query';

function AccountBulkActivateAlertInner({
  name,
  isOpen,
  payload: { accountsIds },

  // #withAlertActions
  closeAlert,
}) {
  const [isLoading, setLoading] = useState(false);
  const { mutateAsync: activateAccount } = useActivateAccount();

  // Handle alert cancel.
  const handleClose = () => {
    closeAlert(name);
  };

  // Handle Bulk activate account confirm.
  const handleConfirmBulkActivate = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        accountsIds.map((accountId) => activateAccount(accountId)),
      );
      const failed = results.filter(
        (result) => result.status === 'rejected',
      ).length;

      if (failed === 0) {
        AppToaster.show({
          message: intl.get('the_accounts_have_been_successfully_activated'),
          intent: Intent.SUCCESS,
        });
      } else {
        AppToaster.show({
          message: intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      }
    } finally {
      setLoading(false);
      closeAlert(name);
    }
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={`${intl.get('activate')} (${accountsIds.length})`}
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

export const AccountBulkActivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(AccountBulkActivateAlertInner);
