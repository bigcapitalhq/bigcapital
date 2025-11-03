// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import { useBulkDeleteExpenses } from '@/hooks/query/expenses';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Expense bulk delete alert.
 */
function ExpenseBulkDeleteAlert({
  closeAlert,
  name,
  payload: { expensesIds },
  isOpen,
}) {
  const { mutateAsync: bulkDeleteExpenses, isLoading } = useBulkDeleteExpenses();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteExpenses(expensesIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_expenses_have_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('expenses-table');
        closeAlert(name);
      })
      .catch((errors) => {
        // Handle errors
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={
        <T id={'delete_count'} values={{ count: expensesIds?.length || 0 }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_these_expenses_you_will_not_able_restore_them'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ExpenseBulkDeleteAlert);
