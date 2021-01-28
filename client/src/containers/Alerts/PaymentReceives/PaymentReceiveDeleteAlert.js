import React, { useCallback, useState } from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withPaymentReceivesActions from 'containers/Sales/PaymentReceive/withPaymentReceivesActions';

import { compose } from 'utils';

/**
 * Payment receive delete alert.
 */
function PaymentReceiveDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { paymentReceiveId },

  // #withPaymentReceivesActions
  requestDeletePaymentReceive,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // Handle cancel payment Receive.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm delete payment receive.
  const handleConfirmPaymentReceiveDelete = useCallback(() => {
    setLoading(true);
    requestDeletePaymentReceive(paymentReceiveId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_payment_receive_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('paymentReceives-table');
      })
      .catch(() => {})
      .finally(() => {
        closeAlert(name);
        setLoading(false);
      });
  }, [paymentReceiveId, requestDeletePaymentReceive, formatMessage]);

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmPaymentReceiveDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_payment_receive_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withPaymentReceivesActions,
)(PaymentReceiveDeleteAlert);
