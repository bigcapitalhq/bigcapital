// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import { useBulkDeleteBills } from '@/hooks/query/bills';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Bill bulk delete alert.
 */
function BillBulkDeleteAlert({
  name,
  isOpen,
  payload: { billsIds },
  closeAlert,
}) {
  const { mutateAsync: bulkDeleteBills, isLoading } = useBulkDeleteBills();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteBills(billsIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_bills_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('bills-table');
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
        <T id={'delete_count'} values={{ count: billsIds?.length || 0 }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_these_bills_you_will_not_able_restore_them'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(BillBulkDeleteAlert);

