// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import { useBulkDeleteEstimates } from '@/hooks/query/estimates';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Estimate bulk delete alert.
 */
function EstimateBulkDeleteAlert({
  name,
  isOpen,
  payload: { estimatesIds },
  closeAlert,
}) {
  const { mutateAsync: bulkDeleteEstimates, isLoading } = useBulkDeleteEstimates();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteEstimates(estimatesIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_estimates_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('estimates-table');
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
        <T id={'delete_count'} values={{ count: estimatesIds?.length || 0 }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_these_estimates_you_will_not_able_restore_them'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(EstimateBulkDeleteAlert);

