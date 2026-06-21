// @ts-nocheck
import React, { useState } from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from '@/components';

import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withAlertActions } from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';
import { useInactivateAccount } from '@/hooks/query';

function AccountBulkInactivateAlertInner({
  name,
  isOpen,
  payload: { accountsIds },

  // #withAlertActions
  closeAlert,
}) {
  const [isLoading, setLoading] = useState(false);
  const { mutateAsync: inactivateAccount } = useInactivateAccount();

  // Handle alert cancel.
  const handleCancel = () => {
    closeAlert(name);
  };

  // Handle Bulk Inactive accounts confirm.
  const handleConfirmBulkInactive = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        accountsIds.map((accountId) => inactivateAccount(accountId)),
      );
      const failed = results.filter(
        (result) => result.status === 'rejected',
      ).length;

      if (failed === 0) {
        AppToaster.show({
          message: intl.get('the_accounts_have_been_successfully_inactivated'),
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
      confirmButtonText={`${intl.get('inactivate')} (${accountsIds.length})`}
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

export const AccountBulkInactivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(AccountBulkInactivateAlertInner);
