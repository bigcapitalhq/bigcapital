// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';

import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withAlertActions } from '@/containers/Alert/withAlertActions';

import { useUncategorizeTransactionsBulkAction } from '@/hooks/query/banking';
import { flow } from 'fp-ts/function';

/**
 * Uncategorize bank account transactions in build alert.
 */
function UncategorizeBankTransactionsBulkAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { uncategorizeTransactionsIds },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: uncategorizeTransactions, isLoading } =
    useUncategorizeTransactionsBulkAction();

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
      .catch((error) => {
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
      cancelButtonText={<T id={'cancel'} />}
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

export const UncategorizeBankTransactionsBulkAlert = flow(
  withAlertActions,
  withAlertStoreConnect(),
)(UncategorizeBankTransactionsBulkAlertInner);
