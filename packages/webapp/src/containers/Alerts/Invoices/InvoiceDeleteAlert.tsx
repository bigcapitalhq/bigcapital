import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { handleDeleteErrors } from '@/containers/Sales/Invoices/InvoicesLanding/components';
import { useDeleteInvoice } from '@/hooks/query';
import { compose } from '@/utils';

interface InvoiceDeleteAlertPayload {
  invoiceId: number;
}

interface InvoiceDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: InvoiceDeleteAlertPayload;
}

/**
 * Invoice delete alert.
 */
function InvoiceDeleteAlertInner({
  name,
  isOpen,
  payload: { invoiceId },
  closeAlert,
  closeDrawer,
}: InvoiceDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteInvoiceMutate, isPending: isLoading } =
    useDeleteInvoice();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

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
        ({ data: { errors } }: { data: { errors: { type: string }[] } }) => {
          handleDeleteErrors(errors);
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmInvoiceDelete}
      loading={isLoading}
    >
      <p data-testId={'invoice-delete-alert'}>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={'once_delete_this_invoice_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export const InvoiceDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(InvoiceDeleteAlertInner);
