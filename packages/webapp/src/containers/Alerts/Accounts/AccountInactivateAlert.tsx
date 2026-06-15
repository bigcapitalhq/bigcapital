// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withAlertActions } from '@/containers/Alert/withAlertActions';

import { useInactivateAccount } from '@/hooks/query';
import { flow } from 'fp-ts/function';

/**
 * Account inactivate alert.
 */
function AccountInactivateAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { accountId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: inactivateAccount, isLoading } = useInactivateAccount();

  const handleCancelInactiveAccount = () => {
    closeAlert('account-inactivate');
  };

  const handleConfirmAccountActive = () => {
    inactivateAccount(accountId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_account_has_been_successfully_inactivated'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {})
      .finally(() => {
        closeAlert('account-inactivate');
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'inactivate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelInactiveAccount}
      onConfirm={handleConfirmAccountActive}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_inactive_this_account'} />
      </p>
    </Alert>
  );
}

export const AccountInactivateAlert = flow(
  withAlertActions,
  withAlertStoreConnect(),
)(AccountInactivateAlertInner);
