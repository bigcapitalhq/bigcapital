import { Intent, Alert } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithAlertStoreConnectProps } from '@/containers/Alert/withAlertStoreConnect';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { usePauseFeedsBankAccount } from '@/hooks/query/banking';
import { compose } from '@/utils';

interface PauseFeedsBankAccountAlertProps
  extends Pick<WithAlertActionsProps, 'closeAlert'>,
    WithAlertStoreConnectProps {
  name: string;
}

/**
 * Pause feeds of the bank account alert.
 */
function PauseFeedsBankAccountAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload,

  // #withAlertActions
  closeAlert,
}: PauseFeedsBankAccountAlertProps) {
  const { mutateAsync: pauseBankAccountFeeds, isPending: isLoading } =
    usePauseFeedsBankAccount();

  const bankAccountId = payload?.bankAccountId as number;

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
      .catch(() => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
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

export const PauseFeedsBankAccount = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(PauseFeedsBankAccountAlert);
