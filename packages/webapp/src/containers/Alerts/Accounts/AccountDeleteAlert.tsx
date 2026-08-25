import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { handleDeleteErrors } from '@/containers/Accounts/utils';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useDeleteAccount } from '@/hooks/query';
import { compose } from '@/utils';

interface AccountDeleteAlertPayload {
  accountId: number;
}

interface AccountDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: AccountDeleteAlertPayload;
}

/**
 * Account delete alert.
 */
function AccountDeleteAlertInner({
  name,
  isOpen,
  payload: { accountId },
  closeAlert,
  closeDrawer,
}: AccountDeleteAlertProps): React.ReactElement {
  const { isPending: isLoading, mutateAsync: deleteAccount } =
    useDeleteAccount();

  const handleCancelAccountDelete = () => {
    closeAlert(name);
  };

  const handleConfirmAccountDelete = () => {
    deleteAccount(accountId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_account_has_been_successfully_deleted'),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
        closeDrawer(DRAWERS.ACCOUNT_DETAILS);
      })
      .catch(
        ({ data: { errors } }: { data: { errors: { type: string }[] } }) => {
          handleDeleteErrors(errors);
          closeAlert(name);
        },
      );
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelAccountDelete}
      onConfirm={handleConfirmAccountDelete}
      loading={isLoading}
    >
      <p data-testId={'account-delete-alert'}>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={'once_delete_this_account_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export const AccountDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(AccountDeleteAlertInner);
