import React, { useCallback, useState } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withInvoiceActions from 'containers/Sales/Invoice/withInvoiceActions';

import { compose } from 'utils';

/**
 * Invoice  alert.
 */
function InvoiceDeliverAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { invoiceId },

  // #withInvoiceActions
  requestDeliverInvoice,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // handle cancel delete deliver alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm invoice deliver.
  const handleConfirmInvoiceDeliver = useCallback(() => {
    setLoading(true);
    requestDeliverInvoice(invoiceId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_invoice_has_been_delivered_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('invoices-table');
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
        setLoading(false);
      });
  }, [invoiceId, requestDeliverInvoice, formatMessage]);

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
  withInvoiceActions,
)(InvoiceDeliverAlert);
