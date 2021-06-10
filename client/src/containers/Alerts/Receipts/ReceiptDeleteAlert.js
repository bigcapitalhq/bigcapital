import React from 'react';
import intl from 'react-intl-universal';
import {  FormattedMessage as T, FormattedHTMLMessage } from 'components';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';

import { useDeleteReceipt } from 'hooks/query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Invoice  alert.
 */
function NameDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { receiptId },

  // #withAlertActions
  closeAlert,
}) {
  
  const {
    mutateAsync: deleteReceiptMutate,
    isLoading
  } = useDeleteReceipt();

  // Handle cancel delete  alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm delete receipt
  const handleConfirmReceiptDelete = () => {
    deleteReceiptMutate(receiptId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_receipt_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmReceiptDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_receipt_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(NameDeleteAlert);
