import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useBulkInactivateAccounts } from '@/hooks/query/accounts';
import { compose } from '@/utils';

interface AccountBulkInactivateAlertPayload {
  accountsIds: number[];
}

interface AccountBulkInactivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: AccountBulkInactivateAlertPayload;
}

function AccountBulkInactivateAlertInner({
  name,
  isOpen,
  payload: { accountsIds },
  closeAlert,
}: AccountBulkInactivateAlertProps): React.ReactElement {
  const { mutateAsync: bulkInactivate, isPending } = useBulkInactivateAccounts();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirmBulkInactive = async () => {
    try {
      await bulkInactivate({ ids: accountsIds });
      AppToaster.show({
        message: intl.get('the_accounts_have_been_successfully_inactivated'),
        intent: Intent.SUCCESS,
      });
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
      confirmButtonText={`${intl.get('inactivate')} (${accountsIds.length})`}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkInactive}
      loading={isPending}
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
