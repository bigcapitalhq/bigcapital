import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useInactivateAccount } from '@/hooks/query';
import { compose } from '@/utils';

interface AccountInactivateAlertPayload {
  accountId: number;
}

interface AccountInactivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: AccountInactivateAlertPayload;
}

/**
 * Account inactivate alert.
 */
function AccountInactivateAlertInner({
  name,
  isOpen,
  payload: { accountId },
  closeAlert,
}: AccountInactivateAlertProps): React.ReactElement {
  const { mutateAsync: inactivateAccount, isPending: isLoading } =
    useInactivateAccount();

  const handleCancelInactiveAccount = () => {
    closeAlert(name);
  };

  const handleConfirmAccountActive = () => {
    inactivateAccount(accountId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_account_has_been_successfully_inactivated'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck hid an empty `.catch(() => {})` that silently swallowed failures.
        AppToaster.show({
          message: error.message,
          intent: Intent.DANGER,
        });
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('inactivate')}
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

export const AccountInactivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(AccountInactivateAlertInner);
