import React, { useCallback, useState } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withReceiptActions from 'containers/Sales/Receipt/withReceiptActions';

import { compose } from 'utils';

/**
 * Receipt close alert.
 */
function ReceiptCloseAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { receiptId },

  // #withReceiptActions
  requestCloseReceipt,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // handle cancel delete  alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm receipt close.
  const handleConfirmReceiptClose = useCallback(() => {
    setLoading(true);
    requestCloseReceipt(receiptId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_receipt_has_been_closed_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('receipts-table');
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
        setLoading(false);
      });
  }, [receiptId, requestCloseReceipt, formatMessage]);

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
  withReceiptActions,
)(ReceiptCloseAlert);
