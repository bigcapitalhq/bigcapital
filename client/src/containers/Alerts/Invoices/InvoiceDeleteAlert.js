import React, { useCallback } from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';

import { AppToaster } from 'components';
import { useDeleteInvoice } from 'hooks/query';

import { handleDeleteErrors } from 'containers/Sales/Invoice/components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withInvoiceActions from 'containers/Sales/Invoice/withInvoiceActions';

import { compose } from 'utils';

/**
 * Invoice delete alert.
 */
function InvoiceDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { invoiceId },

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const {
    mutateAsync: deleteInvoiceMutate,
    isLoading
  } = useDeleteInvoice();

  // handle cancel delete invoice  alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handleConfirm delete invoice
  const handleConfirmInvoiceDelete = () => {
    deleteInvoiceMutate(invoiceId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_invoice_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        handleDeleteErrors(errors);
      })
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
      onConfirm={handleConfirmInvoiceDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_invoice_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withInvoiceActions,
)(InvoiceDeleteAlert);
