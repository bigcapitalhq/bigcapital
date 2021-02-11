import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';

import { useDeliverInvoice } from 'hooks/query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Sale invoice alert.
 */
function InvoiceDeliverAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { invoiceId },

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const {
    mutateAsync: deliverInvoiceMutate,
    isLoading
  } = useDeliverInvoice();

  // handle cancel delete deliver alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm invoice deliver.
  const handleConfirmInvoiceDeliver = () => {
    deliverInvoiceMutate(invoiceId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_invoice_has_been_delivered_successfully',
          }),
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
      confirmButtonText={<T id={'deliver'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmInvoiceDeliver}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_deliver_this_invoice'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(InvoiceDeliverAlert);
