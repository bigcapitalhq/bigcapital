// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useDeliverInvoice } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

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
  const { mutateAsync: deliverInvoiceMutate, isLoading } = useDeliverInvoice();

  // handle cancel delete deliver alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm invoice deliver.
  const handleConfirmInvoiceDeliver = () => {
    deliverInvoiceMutate(invoiceId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_invoice_has_been_delivered_successfully'),
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
