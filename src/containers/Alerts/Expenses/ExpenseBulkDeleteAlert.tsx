// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from '@/components';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Expense bulk delete alert.
 */
function ExpenseBulkDeleteAlert({
  closeAlert,

  // #withAlertStoreConnect
  name,
  payload: { expenseId, selectedCount },
  isOpen,
}) {
  // Handle confirm journals bulk delete.
  const handleConfirmBulkDelete = () => {
    // requestDeleteBulkExpenses(bulkDelete)
    //   .then(() => {
    //     AppToaster.show({
    //       message: formatMessage(
    //         { id: 'the_expenses_have_been_deleted_successfully' },
    //         { count: selectedRowsCount },
    //       ),
    //       intent: Intent.SUCCESS,
    //     });
    //   })
    //   .catch((error) => {
    //   });
  };

  // Handle cancel bulk delete alert.
  const handleCancelBulkDelete = () => {
    closeAlert(name);
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={
        <T id={'delete_count'} values={{ count: selectedCount }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelBulkDelete}
      onConfirm={handleConfirmBulkDelete}
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
