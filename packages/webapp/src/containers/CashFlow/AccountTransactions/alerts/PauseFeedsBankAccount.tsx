// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';

import { AppToaster, FormattedMessage as T } from '@/components';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { usePauseFeedsBankAccount } from '@/hooks/query/bank-accounts';
import { compose } from '@/utils';

/**
 * Pause feeds of the bank account alert.
 */
function PauseFeedsBankAccountAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { bankAccountId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: pauseBankAccountFeeds, isLoading } =
    usePauseFeedsBankAccount();

  // Handle activate item alert cancel.
  const handleCancelActivateItem = () => {
    closeAlert(name);
  };
  // Handle confirm item activated.
  const handleConfirmItemActivate = () => {
    pauseBankAccountFeeds({ bankAccountId })
      .then(() => {
        AppToaster.show({
          message: 'The bank feeds of the bank account has been paused.',
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={'Pause bank feeds'}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelActivateItem}
      loading={isLoading}
      onConfirm={handleConfirmItemActivate}
    >
      <p>
        Are you sure want to pause bank feeds syncing of this bank account, you
        can always resume it again?
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(PauseFeedsBankAccountAlert);
