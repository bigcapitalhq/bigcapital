// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useCloseReceipt } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Receipt close alert.
 */
function ReceiptCloseAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { receiptId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: closeReceiptMutate, isLoading } = useCloseReceipt();

  // handle cancel delete alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm receipt close.
  const handleConfirmReceiptClose = () => {
    closeReceiptMutate(receiptId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_receipt_has_been_closed_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'close'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmReceiptClose}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_close_this_receipt'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ReceiptCloseAlert);
