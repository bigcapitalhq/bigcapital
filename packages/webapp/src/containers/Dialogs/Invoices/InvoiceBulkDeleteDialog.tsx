import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithInvoiceActionsProps } from '@/containers/Sales/Invoices/InvoicesLanding/withInvoiceActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withInvoiceActions } from '@/containers/Sales/Invoices/InvoicesLanding/withInvoiceActions';
import { useBulkDeleteInvoices } from '@/hooks/query/invoices';
import { compose } from '@/utils';

interface InvoiceBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface InvoiceBulkDeleteDialogProps
  extends WithInvoiceActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

/**
 * Invoice bulk delete dialog.
 */
function InvoiceBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withInvoiceActions
  resetInvoicesSelectedRows,

  // #withDialogActions
  closeDialog,
}: InvoiceBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: InvoiceBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeleteInvoices, isPending: isLoading } =
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
      .catch(() => {
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

export const InvoiceBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withInvoiceActions,
)(InvoiceBulkDeleteDialogInner);
