import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { compose } from '@/utils';

interface ClearTransactionAlertPayload {
  // Empty payload — alert reads no payload field.
  [key: string]: unknown;
}

interface ClearTransactionAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: ClearTransactionAlertPayload;
}

/**
 * Clear payment transaction alert.
 */
function ClearPaymentTransactionAlert({
  name,
  isOpen,
  payload,
  closeAlert,
}: ClearTransactionAlertProps): React.ReactElement {
  const handleCancel = () => {
    closeAlert(name);
  };

  // Bugfix: original @ts-nocheck had an empty `() => {}` body — clicking confirm did nothing. Now closes the alert.
  const handleConfirm = () => {
    closeAlert(name);
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('action')}
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

export const ClearTransactionAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ClearPaymentTransactionAlert);
