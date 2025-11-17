// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import { useBulkDeleteReceipts } from '@/hooks/query/receipts';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Receipt bulk delete alert.
 */
function ReceiptBulkDeleteAlert({
  name,
  isOpen,
  payload: { receiptsIds },
  closeAlert,
}) {
  const { mutateAsync: bulkDeleteReceipts, isLoading } = useBulkDeleteReceipts();

  const handleCancel = () => {
    closeAlert(name);
  };
  const handleConfirmBulkDelete = () => {
    bulkDeleteReceipts(receiptsIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_receipts_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('sale-receipts-table');
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
        <T id={'delete_count'} values={{ count: receiptsIds?.length || 0 }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_these_receipts_you_will_not_able_restore_them'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ReceiptBulkDeleteAlert);

