import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { useDeleteExpense } from 'hooks/query';
import { compose } from 'utils';

/**
 * Expense delete alert.
 */
function ExpenseDeleteAlert({
  // #withAlertActions
  closeAlert,

  // #withAlertStoreConnect
  isOpen,
  payload: { expenseId },
}) {
  const { formatMessage } = useIntl();
  const {
    mutateAsync: deleteExpenseMutate,
    isLoading,
  } = useDeleteExpense();

  // Handle cancel expense journal.
  const handleCancelExpenseDelete = () => {
    closeAlert('expense-delete');
  };

  // Handle confirm delete expense.
  const handleConfirmExpenseDelete = () => {
    deleteExpenseMutate(expenseId).then(() => {
      AppToaster.show({
        message: formatMessage(
          { id: 'the_expense_has_been_deleted_successfully' },
          { number: expenseId },
        ),
        intent: Intent.SUCCESS,
      });
    }).finally(() => {
      closeAlert('expense-delete');
    });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelExpenseDelete}
      onConfirm={handleConfirmExpenseDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_this_expense_you_will_able_to_restore_it'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ExpenseDeleteAlert);