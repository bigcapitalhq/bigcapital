// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import { useBulkDeletePaymentReceives } from '@/hooks/query/paymentReceives';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Payment received bulk delete alert.
 */
function PaymentReceivedBulkDeleteAlert({
  name,
  isOpen,
  payload: { paymentsReceivedIds },
  closeAlert,
}) {
  const { mutateAsync: bulkDeletePaymentReceives, isLoading } = useBulkDeletePaymentReceives();

  const handleCancel = () => {
    closeAlert(name);
  };
  const handleConfirmBulkDelete = () => {
    bulkDeletePaymentReceives(paymentsReceivedIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_payments_received_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('payments-received-table');
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
        <T id={'delete_count'} values={{ count: paymentsReceivedIds?.length || 0 }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_these_payments_received_you_will_not_able_restore_them'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(PaymentReceivedBulkDeleteAlert);

