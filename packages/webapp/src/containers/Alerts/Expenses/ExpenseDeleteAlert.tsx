import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { handleDeleteErrors } from './_utils';
import { AppToaster, FormattedMessage as T } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useDeleteExpense } from '@/hooks/query';
import { compose } from '@/utils';

interface ExpenseDeleteAlertPayload {
  expenseId: number;
}

interface ExpenseDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: ExpenseDeleteAlertPayload;
}

/**
 * Expense delete alert.
 */
function ExpenseDeleteAlertInner({
  name,
  closeAlert,
  isOpen,
  payload: { expenseId },
  closeDrawer,
}: ExpenseDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteExpenseMutate, isPending: isLoading } =
    useDeleteExpense();

  const handleCancelExpenseDelete = () => {
    closeAlert(name);
  };

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
        ({ data: { errors } }: { data: { errors: { type: string }[] } }) => {
          handleDeleteErrors(errors);
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelExpenseDelete}
      onConfirm={handleConfirmExpenseDelete}
      loading={isLoading}
    >
      <p data-testId={'expense-delete-alert'}>
        <T id={'once_delete_this_expense_you_will_able_to_restore_it'} />
      </p>
    </Alert>
  );
}

export const ExpenseDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(ExpenseDeleteAlertInner);
