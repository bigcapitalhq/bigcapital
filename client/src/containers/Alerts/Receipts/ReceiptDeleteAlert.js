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
import withReceiptActions from 'containers/Sales/Receipt/withReceiptActions';

import { compose } from 'utils';

/**
 * Invoice  alert.
 */
function NameDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { receiptId },

  // #withReceiptActions
  requestDeleteReceipt,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // handle cancel delete  alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handle confirm delete receipt
  const handleConfirmReceiptDelete = useCallback(() => {
    setLoading(true);
    requestDeleteReceipt(receiptId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_receipt_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('receipts-table');
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        closeAlert(name);
      });
  }, [receiptId, requestDeleteReceipt, formatMessage]);

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
  withReceiptActions,
)(NameDeleteAlert);
