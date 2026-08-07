import { Intent, Alert } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithAlertStoreConnectProps } from '@/containers/Alert/withAlertStoreConnect';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useUncategorizeTransactionsBulkAction } from '@/hooks/query/banking';
import { compose } from '@/utils';

interface UncategorizeBankTransactionsBulkAlertProps
  extends Pick<WithAlertActionsProps, 'closeAlert'>,
    WithAlertStoreConnectProps {
  name: string;
}

/**
 * Uncategorize bank account transactions in build alert.
 */
function UncategorizeBankTransactionsBulkAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload,

  // #withAlertActions
  closeAlert,
}: UncategorizeBankTransactionsBulkAlertProps) {
  const { mutateAsync: uncategorizeTransactions, isPending: isLoading } =
    useUncategorizeTransactionsBulkAction();

  const uncategorizeTransactionsIds = (payload?.uncategorizeTransactionsIds ??
    []) as number[];

  // Handle activate item alert cancel.
  const handleCancelActivateItem = () => {
    closeAlert(name);
  };

  // Handle confirm item activated.
  const handleConfirmItemActivate = () => {
    uncategorizeTransactions({ ids: uncategorizeTransactionsIds })
      .then(() => {
        AppToaster.show({
          message: 'The selected transactions have been uncategorized.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong while uncategorizing transactions.',
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
      confirmButtonText={'Uncategorize Transactions'}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelActivateItem}
      loading={isLoading}
      onConfirm={handleConfirmItemActivate}
    >
      <p>
        Are you sure want to uncategorize the selected bank transactions, this
        action is not reversible but you can always categorize them again?
      </p>
    </Alert>
  );
}

export const UncategorizeBankTransactionsBulkAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(UncategorizeBankTransactionsBulkAlertInner);
