import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { usePublishExpense } from '@/hooks/query';
import { compose } from '@/utils';

interface ExpensePublishAlertPayload {
  expenseId: number;
}

interface ExpensePublishAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: ExpensePublishAlertPayload;
}

/**
 * Expense publish alert.
 */
function ExpensePublishAlertInner({
  closeAlert,
  name,
  payload: { expenseId },
  isOpen,
}: ExpensePublishAlertProps): React.ReactElement {
  const { mutateAsync: publishExpenseMutate, isPending: isLoading } =
    usePublishExpense();

  const handleCancelPublishExpense = () => {
    closeAlert(name);
  };

  const handleConfirmPublishExpense = () => {
    publishExpenseMutate(expenseId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_expense_has_been_published'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck silently closed the alert on error without surfacing the failure.
        AppToaster.show({
          message: error.message,
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
      confirmButtonText={intl.get('publish')}
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

export const ExpensePublishAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ExpensePublishAlertInner);
