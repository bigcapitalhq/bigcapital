// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { usePublishExpense } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * Expense publish alert.
 */
function ExpensePublishAlert({
  closeAlert,

  // #withAlertStoreConnect
  name,
  payload: { expenseId },
  isOpen,
}) {
  const { mutateAsync: publishExpenseMutate, isLoading } = usePublishExpense();

  const handleCancelPublishExpense = () => {
    closeAlert('expense-publish');
  };

  // Handle publish expense confirm.
  const handleConfirmPublishExpense = () => {
    publishExpenseMutate(expenseId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_expense_has_been_published'),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch((error) => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'publish'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelPublishExpense}
      onConfirm={handleConfirmPublishExpense}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_publish_this_expense'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ExpensePublishAlert);
