// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import withAlertActions from '@/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';

import { compose } from '@/utils';

/**
 * Alert description.
 */
function ClearPaymentTransactionAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: {  },

  // #withAlertActions
  closeAlert,
}) {
  // Handle the alert cancel.
  const handleCancel = () => {
    closeAlert(name);
  };

  // Handle confirm delete manual journal.
  const handleConfirm = () => {
     
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'action'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={false}
    >
      <p>
        <T id={'are_you_sure_you_want_to_clear_this_transaction'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ClearPaymentTransactionAlert);