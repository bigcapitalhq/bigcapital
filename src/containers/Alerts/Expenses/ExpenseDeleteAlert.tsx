import React from 'react';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

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

  // #withDrawerActions
  closeDrawer,
}) {
  const { mutateAsync: deleteExpenseMutate, isLoading } = useDeleteExpense();

  // Handle cancel expense journal.
  const handleCancelExpenseDelete = () => {
    closeAlert('expense-delete');
  };

  // Handle confirm delete expense.
  const handleConfirmExpenseDelete = () => {
    deleteExpenseMutate(expenseId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_expense_has_been_deleted_successfully', {
            number: expenseId,
          }),
          intent: Intent.SUCCESS,
        });
        closeDrawer('expense-drawer');
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          if (
            errors.find((e) => e.type === 'EXPENSE_HAS_ASSOCIATED_LANDED_COST')
          ) {
            AppToaster.show({
              intent: Intent.DANGER,
              message: intl.get(
                'couldn_t_delete_expense_transaction_has_associated_located_landed_cost_transaction',
              ),
            });
          }
        },
      )
      .finally(() => {
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
  withDrawerActions,
)(ExpenseDeleteAlert);
