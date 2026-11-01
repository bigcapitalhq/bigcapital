import { DialogsName } from '@/constants/dialogs';
import { index as InvoicePdfPreviewDialog } from '@/containers/Dialogs/InvoicePdfPreviewDialog';
import { InvoiceBulkDeleteDialog } from '@/containers/Dialogs/Invoices/InvoiceBulkDeleteDialog';

export function InvoicesListDialogs() {
  return (
    <>
      <InvoiceBulkDeleteDialog dialogName={DialogsName.InvoiceBulkDelete} />
      <InvoicePdfPreviewDialog dialogName={DialogsName.InvoicePdfForm} />
    </>
  );
}
