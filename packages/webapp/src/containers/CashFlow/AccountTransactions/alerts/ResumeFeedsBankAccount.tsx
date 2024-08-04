// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';

import { AppToaster, FormattedMessage as T } from '@/components';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { useResumeFeedsBankAccount } from '@/hooks/query/bank-accounts';
import { compose } from '@/utils';

/**
 * Resume bank account feeds alert. 
 */
function ResumeFeedsBankAccountAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { bankAccountId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: resumeFeedsBankAccount, isLoading } =
    useResumeFeedsBankAccount();

  // Handle activate item alert cancel.
  const handleCancelActivateItem = () => {
    closeAlert(name);
  };

  // Handle confirm item activated.
  const handleConfirmItemActivate = () => {
    resumeFeedsBankAccount({ bankAccountId })
      .then(() => {
        AppToaster.show({
          message: 'The bank feeds of the bank account has been resumed.',
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
      confirmButtonText={'Resume bank feeds'}
      intent={Intent.SUCCESS}
      isOpen={isOpen}
      onCancel={handleCancelActivateItem}
      loading={isLoading}
      onConfirm={handleConfirmItemActivate}
    >
      <p>
        Are you sure want to resume bank feeds syncing of this bank account, you
        can always pause it again?
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ResumeFeedsBankAccountAlert);
