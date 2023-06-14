// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import {
  AppToaster,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';
import { useDeleteInvoice } from '@/hooks/query';

import { handleDeleteErrors } from '@/containers/Sales/Invoices/InvoicesLanding/components';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

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

  // #withDrawerActions
  closeDrawer,
}) {
  const { mutateAsync: deleteInvoiceMutate, isLoading } = useDeleteInvoice();

  // handle cancel delete invoice alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handleConfirm delete invoice
  const handleConfirmInvoiceDelete = () => {
    deleteInvoiceMutate(invoiceId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_invoice_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.INVOICE_DETAILS);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          handleDeleteErrors(errors);
        },
      )
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
  withDrawerActions,
)(InvoiceDeleteAlert);
