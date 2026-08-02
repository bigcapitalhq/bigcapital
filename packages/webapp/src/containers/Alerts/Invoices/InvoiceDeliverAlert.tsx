import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useDeliverInvoice } from '@/hooks/query';
import { compose } from '@/utils';

interface InvoiceDeliverAlertPayload {
  invoiceId: number;
}

interface InvoiceDeliverAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: InvoiceDeliverAlertPayload;
}

/**
 * Sale invoice alert.
 */
function InvoiceDeliverAlertInner({
  name,
  isOpen,
  payload: { invoiceId },
  closeAlert,
}: InvoiceDeliverAlertProps): React.ReactElement {
  const { mutateAsync: deliverInvoiceMutate, isPending: isLoading } =
    useDeliverInvoice();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmInvoiceDeliver = () => {
    deliverInvoiceMutate(invoiceId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_invoice_has_been_delivered_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch((error) => {})` that silently swallowed failures.
        AppToaster.show({
          message: error.message,
          intent: Intent.DANGER,
        });
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('deliver')}
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

export const InvoiceDeliverAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(InvoiceDeliverAlertInner);
