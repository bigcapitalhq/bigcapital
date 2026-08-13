import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAccountsTableActions } from '@/containers/Accounts/withAccountsTableActions';
import type { WithAccountsTableActionsProps } from '@/containers/Accounts/withAccountsTableActions';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useBulkActivateAccounts } from '@/hooks/query/accounts';
import { compose } from '@/utils';

interface AccountBulkActivateAlertPayload {
  accountsIds: number[];
}

interface AccountBulkActivateAlertProps
  extends WithAlertActionsProps,
    WithAccountsTableActionsProps {
  name: string;
  isOpen: boolean;
  payload: AccountBulkActivateAlertPayload;
}

function AccountBulkActivateAlertInner({
  name,
  isOpen,
  payload: { accountsIds },
  closeAlert,
  resetAccountsSelectedRows,
}: AccountBulkActivateAlertProps): React.ReactElement {
  const { mutateAsync: bulkActivate, isPending } = useBulkActivateAccounts();

  const handleClose = () => {
    closeAlert(name);
  };

  const handleConfirmBulkActivate = async () => {
    try {
      await bulkActivate({ ids: accountsIds });
      AppToaster.show({
        message: intl.get('the_accounts_has_been_successfully_activated'),
        intent: Intent.SUCCESS,
      });
      resetAccountsSelectedRows();
    } catch (error: unknown) {
      // Replaced `(error as Error)?.message` cast with instanceof narrowing.
      const message =
        error instanceof Error
          ? error.message
          : intl.get('something_went_wrong');
      AppToaster.show({
        message,
        intent: Intent.DANGER,
      });
    } finally {
      closeAlert(name);
    }
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={`${intl.get('activate')} (${accountsIds.length})`}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleClose}
      onConfirm={handleConfirmBulkActivate}
      loading={isPending}
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
  withAccountsTableActions,
)(AccountBulkActivateAlertInner);
