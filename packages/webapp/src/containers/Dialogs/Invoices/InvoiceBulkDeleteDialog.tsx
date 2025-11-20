// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';

import withDialogRedux from '@/components/DialogReduxConnect';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withInvoiceActions from '@/containers/Sales/Invoices/InvoicesLanding/withInvoiceActions';
import { useBulkDeleteInvoices } from '@/hooks/query/invoices';
import { AppToaster } from '@/components';
import BulkDeleteDialogContent from '@/containers/Dialogs/components/BulkDeleteDialogContent';

import { compose } from '@/utils';

/**
 * Invoice bulk delete dialog.
 */
function InvoiceBulkDeleteDialog({
  dialogName,
  isOpen,
  payload: {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  } = {},

  // #withInvoiceActions
  resetInvoicesSelectedRows,

  // #withDialogActions
  closeDialog,
}) {
  const { mutateAsync: bulkDeleteInvoices, isLoading } =
    useBulkDeleteInvoices();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteInvoices({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_invoices_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetInvoicesSelectedRows();
        closeDialog(dialogName);
      })
      .catch((errors) => {
        AppToaster.show({
          message: intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      });
  };

  return (
    <Dialog
      title={
        <T
          id={'bulk_delete_dialog_title'}
          values={{ resourcePlural: intl.get('resource_invoice_plural') }}
        />
      }
      isOpen={isOpen}
      onClose={handleCancel}
      canEscapeKeyClose={!isLoading}
      canOutsideClickClose={!isLoading}
    >
      <BulkDeleteDialogContent
        totalSelected={totalSelected}
        deletableCount={deletableCount}
        undeletableCount={undeletableCount}
        resourceSingularLabel={intl.get('resource_invoice_singular')}
        resourcePluralLabel={intl.get('resource_invoice_plural')}
      />

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCancel} disabled={isLoading}>
            <T id={'cancel'} />
          </Button>

          <Button
            intent={Intent.DANGER}
            onClick={handleConfirmBulkDelete}
            loading={isLoading}
            disabled={deletableCount === 0 || isLoading}
          >
            <T id={'delete_count'} values={{ count: deletableCount }} />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default compose(
  withDialogRedux(),
  withDialogActions,
  withInvoiceActions,
)(InvoiceBulkDeleteDialog);
