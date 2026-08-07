import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useActivateAccount } from '@/hooks/query';
import { compose } from '@/utils';

interface AccountActivateAlertPayload {
  accountId: number;
}

interface AccountActivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: AccountActivateAlertPayload;
}

/**
 * Account activate alert.
 */
function AccountActivateAlertInner({
  name,
  isOpen,
  payload: { accountId },
  closeAlert,
}: AccountActivateAlertProps): React.ReactElement {
  const { mutateAsync: activateAccount, isPending: isLoading } =
    useActivateAccount();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirmAccountActivate = () => {
    activateAccount(accountId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_account_has_been_successfully_activated'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
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
      confirmButtonText={intl.get('activate')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmAccountActivate}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_activate_this_account'} />
      </p>
    </Alert>
  );
}

export const AccountActivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(AccountActivateAlertInner);
