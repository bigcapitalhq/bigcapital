// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { useDeleteExpense } from '@/hooks/query';
import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';
import { handleDeleteErrors } from './_utils';

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
        closeDrawer(DRAWERS.EXPENSE_DETAILS);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          handleDeleteErrors(errors);
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
